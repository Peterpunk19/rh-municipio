"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Tabs, Tab } from "@mui/material";
import Box from "@mui/material/Box";
import { fetchCatalogData } from "@/services/catalogs";
import { useDispatch, useSelector } from "@/store/hooks";
import { updateFilter } from "@/store/tables/FiltersSlice";
import { RootState } from "@/store/store";
import { a11yProps } from "@/common/utils";
import { updatePage } from "@/store/tables/PaginationSlice";
import LoadingComponent from "@/components/customComponents/LoadingComponent";

interface RequestStatus {
  id: string;
  displayName: string;
  total: number;
}

const CustomRequestStatusComponent = () => {
  const ENTITY = "employeeRequests";
  const dispatch = useDispatch();
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { searchTerm } = useSelector(
    (state: RootState) => state.filters.employeeRequests || { searchTerm: "", values: {} },
  );
  
  const { values } = useSelector(
    (state: RootState) => state.filters[ENTITY] || { values: {} }
  );

  const [value, setValue] = React.useState(0);
  const [requestStatuses, setRequestStatuses] = useState<RequestStatus[]>([]);
  const [initialStatuses, setInitialStatuses] = useState<RequestStatus[]>([]);

  useEffect(() => {
    const loadInitialStatuses = async () => {
      try {
        setInitialLoading(true);
        const response = await fetchCatalogData("requests-status", {});
        
        if (response?.success && response?.responseObject) {
          const statuses = response.responseObject.map((status: any) => ({
            id: status.id,
            displayName: status.display_name || status.displayName || "Sin nombre",
            total: parseInt(status.total) || 0
          }));
          
          setInitialStatuses(statuses);
          setRequestStatuses(statuses);
        } else {
          console.warn('[CustomRequestStatusComponent] Error al cargar estados iniciales');
          setError('No se pudieron cargar los estados');
        }
      } catch (e) {
        console.error('[CustomRequestStatusComponent] Error loading initial statuses:', e);
        setError('Error al cargar los estados');
      } finally {
        setInitialLoading(false);
      }
    };
    
    loadInitialStatuses();
  }, []);

  const updateStatusCounts = useCallback(async () => {
    try {
      const queryParams: Record<string, any> = {};
      
      if (values?.request_id && values.request_id !== "" && values.request_id !== 0) {
        queryParams.request_id = values.request_id;
      }
      
      if (searchTerm && searchTerm.trim() !== "") {
        queryParams.search = searchTerm;
      }

      if (Object.keys(queryParams).length > 0) {
        const response = await fetchCatalogData("requests-status", queryParams);
        if (response?.success && response?.responseObject) {
          const updatedStatuses = response.responseObject.map((status: any) => ({
            id: status.id,
            displayName: status.display_name || status.displayName || "Sin nombre",
            total: parseInt(status.total) || 0
          }));
          setRequestStatuses(updatedStatuses);
        }
      } else {
        setRequestStatuses(initialStatuses);
      }
    } catch (e) {
      console.error('[CustomRequestStatusComponent] Error updating counts:', e);
    }
  }, [values?.request_id, searchTerm, initialStatuses]);

  useEffect(() => {
    if (!initialLoading) {
      updateStatusCounts();
    }
  }, [updateStatusCounts, initialLoading]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    dispatch(updatePage(1));
    setValue(newValue);
  };

  const handleTabClick = (statusId: string | null) => {
    dispatch(updatePage(1));
    dispatch(
      updateFilter({
        entity: ENTITY,
        key: "request_status_id",
        value: statusId || "",
      }),
    );
  };

  const totalRequests = requestStatuses.reduce((sum, status) => sum + (status.total || 0), 0);

  if (initialLoading) {
    return (
        <LoadingComponent />
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2, color: 'error.main', textAlign: 'center' }}>
        {error}
      </Box>
    );
  }

  return (
    <Box sx={{ border: 1, borderColor: "divider", mb: 2 }}>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="request status tabs"
        textColor="secondary"
        sx={{
          backgroundColor: "#1e2327",
        }}
        allowScrollButtonsMobile
        scrollButtons
        indicatorColor="secondary"
      >
        <Tab
          key="all_status"
          sx={{
            textTransform: "capitalize",
            color: "#fff",
            backgroundColor: "#1e2327",
          }}
          onClick={() => handleTabClick(null)}
          label={`(${totalRequests}) TODAS`}
          {...a11yProps(ENTITY, 0)}
        />
        {requestStatuses.length > 0 &&
          requestStatuses.map((status, index) => (
            <Tab
              key={`${status.id}_status`}
              sx={{
                textTransform: "capitalize",
                color: "#fff",
                backgroundColor: "#1e2327",
              }}
              onClick={() => handleTabClick(status.id)}
              label={`(${status.total !== null ? status.total : 0}) ${status.displayName}`}
              {...a11yProps(ENTITY, index + 1)}
            />
          ))}
      </Tabs>
    </Box>
  );
};

export default CustomRequestStatusComponent;
