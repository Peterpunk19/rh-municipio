import { useState, useEffect } from "react";
import type { FiltersConfig } from "@/interfaces/FiltersConfig";

export const useDynamicFilters = (filtersConfig: FiltersConfig[]) => {
  const [selectedValues, setSelectedValues] = useState<Record<string, any>>({});
  const [optionsState, setOptionsState] = useState<Record<string, Array<{ value: any; label: string }>>>({});

  useEffect(() => {
    const fetchOptionsForFilters = async () => {
      const newOptions: Record<string, Array<{ value: any; label: string }>> = {};

      for (const filter of filtersConfig) {
        if (filter.fetchOptions) {
          try {
            const params = filter.dependsOn ? selectedValues[filter.dependsOn] : undefined;
            const response = await filter.fetchOptions(params);
            if (response?.responseObject) {
              newOptions[filter.key] = response.responseObject.map((item) => ({
                value: item.id,
                label: item.display_name || item.name,
              }));
            } else {
              newOptions[filter.key] = [];
            }
          } catch (error) {
            console.error(`Error cargando opciones para ${filter.key}:`, error);
            newOptions[filter.key] = [];
          }
        }
      }

      setOptionsState((prev) => ({ ...prev, ...newOptions }));
    };

    fetchOptionsForFilters();
  }, [selectedValues]);

  const handleFilterChange = (key: string, value: any) => {
    setSelectedValues((prev) => ({
      ...prev,
      [key]: value,
      ...(filtersConfig.find((f) => f.dependsOn === key)?.key && {
        [filtersConfig.find((f) => f.dependsOn === key)!.key]: null,
      }),
    }));
  };

  const filtersWithData = filtersConfig.map((filter) => ({
    ...filter,
    options: optionsState[filter.key] || filter.options || [],
  }));

  return {
    filters: filtersWithData,
    selectedValues,
    handleFilterChange,
  };
};
