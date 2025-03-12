"use client";

import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "@mui/material";
import Box from "@mui/material/Box";
import { fetchStatusIncidentsData } from "@/services/catalogs";
import { useDispatch, useSelector } from "@/store/hooks";
import { updateFilter } from "@/store/tables/FiltersSlice";
import { RootState } from "@/store/store";
import { a11yProps } from "@/common/utils";
import { updatePage } from "@/store/tables/PaginationSlice";

const CustomIncidentStatusComponent = () => {
  const ENTITY = "employeesIncidents";
  const dispatch = useDispatch();
  const { searchTerm } = useSelector(
    (state: RootState) => state.filters.employeesIncidents || { searchTerm: "", values: {} },
  );

  const [value, setValue] = React.useState(0);
  const [total, setTotal] = React.useState(0);
  const [data, setData] = useState([]);
  const { values: initialValuesFromRedux } = useSelector((state: RootState) => state.filters[ENTITY]);

  const IncidentsStatusFetchData = async () => {
    const params = { ...initialValuesFromRedux, search: searchTerm };

    await fetchStatusIncidentsData(params)
      .then((response) => {
        if (response?.responseObject) {
          setData(response.responseObject);
          const totalSum = response.responseObject.reduce((sum, incident) => sum + (incident.total || 0), 0);
          setTotal(totalSum);
        } else {
          setData([]);
          setTotal(0);
        }
      })
      .catch((e) => {
        console.log(e);
        setData([]);
        setTotal(0);
      });
  };

  const handleChange = async (event: any, newValue: any) => {
    dispatch(updatePage(1));
    await IncidentsStatusFetchData();
    setValue(newValue);
  };

  useEffect(() => {
    IncidentsStatusFetchData();
  }, [initialValuesFromRedux, searchTerm]);

  return (
    <Box sx={{ border: 1, borderColor: "divider", mb: 2 }}>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="basic tabs example"
        textColor="secondary"
        sx={{
          backgroundColor: "#1e2327",
        }}
        allowScrollButtonsMobile
        scrollButtons
        indicatorColor="secondary"
      >
        <Tab
          key={`todo_status`}
          sx={{
            textTransform: "capitalize",
            color: "#fff",
            backgroundColor: "#1e2327",
          }}
          onClick={() => {
            dispatch(
              updateFilter({
                entity: ENTITY,
                key: "incident_status_id",
                value: "",
              }),
            );
          }}
          label={`(${total}) TODAS`}
          {...a11yProps(ENTITY, 0)}
        />
        {data &&
          data.map((incidentStatus) => {
            return (
              <Tab
                key={`${incidentStatus.id}_status`}
                sx={{
                  textTransform: "capitalize",
                  color: "#fff",
                  backgroundColor: "#1e2327",
                }}
                onClick={() => {
                  dispatch(
                    updateFilter({
                      entity: ENTITY,
                      key: "incident_status_id",
                      value: incidentStatus.id,
                    }),
                  );
                }}
                label={`(${incidentStatus.total !== null ? incidentStatus.total : 0}) ${incidentStatus.display_name}`}
                {...a11yProps(ENTITY, incidentStatus.id)}
              />
            );
          })}
      </Tabs>
    </Box>
  );
};

export default CustomIncidentStatusComponent;
