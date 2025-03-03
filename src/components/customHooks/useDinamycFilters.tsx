import { useState, useEffect, useCallback, useRef } from "react";
import type { FiltersConfig } from "@/interfaces/FiltersConfig";
import { useSelector, useDispatch } from "@/store/hooks";
import { setCatalog } from "@/store/tables/CatalogsSlice";
import { fetchWithRetry } from "@/utils/api/fetchUtils";

export const useDynamicFilters = (filtersConfig: FiltersConfig[], initialValues: Record<string, any>) => {
  const dispatch = useDispatch();
  const catalogs = useSelector((state) => state.catalogs);
  const [selectedValues, setSelectedValues] = useState(initialValues);
  const pendingRequests = useRef<Record<string, boolean>>({});

  const getCatalogKey = useCallback(
    (filter: FiltersConfig) => {
      return filter.dependsOn ? `${filter.key}_${selectedValues[filter.dependsOn]}` : filter.key;
    },
    [selectedValues],
  );

  const fetchAndCacheCatalog = useCallback(
    async (filter: FiltersConfig) => {
      if (!filter.fetchOptions) return;
      const catalogKey = getCatalogKey(filter);
      if (pendingRequests.current[catalogKey]) return;
      pendingRequests.current[catalogKey] = true;
      try {
        const catalogData = await fetchWithRetry(async () => {
          const params = filter.dependsOn ? selectedValues[filter.dependsOn] : undefined;
          const response = await filter.fetchOptions!(params);
          return (
            response?.responseObject?.map((item: any) => ({
              value: item.id,
              label: item.display_name || item.name,
            })) || []
          );
        });

        dispatch(setCatalog({ key: catalogKey, data: catalogData }));
      } catch (error) {
        console.error(`Error fetching catalog ${filter.key}:`, error);
      } finally {
        delete pendingRequests.current[catalogKey];
      }
    },
    [dispatch, getCatalogKey, selectedValues],
  );

  useEffect(() => {
    const abortController = new AbortController();

    const loadCatalogs = async () => {
      const fetchPromises = filtersConfig
        .filter((filter) => {
          if (!filter.fetchOptions) return false;
          const catalogKey = getCatalogKey(filter);
          return !catalogs[catalogKey] && !pendingRequests.current[catalogKey];
        })
        .map((filter) => fetchAndCacheCatalog(filter));
      await Promise.all(fetchPromises);
    };

    if (!abortController.signal.aborted) {
      loadCatalogs();
    }

    return () => {
      abortController.abort();
    };
  }, [filtersConfig, catalogs, fetchAndCacheCatalog, getCatalogKey]);

  const handleFilterChange = (key: string, value: any) => {
    setSelectedValues((prev) => ({ ...prev, [key]: value }));

    filtersConfig
      .filter((f) => f.dependsOn === key)
      .forEach((f) => {
        setSelectedValues((prev) => ({ ...prev, [f.key]: null }));
      });
  };

  const getCatalogOptions = (filter: FiltersConfig) => {
    const catalogKey = getCatalogKey(filter);
    return catalogs[catalogKey] || filter.options || [];
  };

  return {
    filters: filtersConfig.map((filter) => ({
      ...filter,
      options: getCatalogOptions(filter),
      value: selectedValues[filter?.key],
    })),
    selectedValues,
    handleFilterChange,
  };
};
