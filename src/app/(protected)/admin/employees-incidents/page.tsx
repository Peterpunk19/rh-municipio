"use client";
import React, { useEffect } from "react";
import TableWithPagination from "@/components/tables/TableWithPagination";
import type { EmployeeType } from "@/types/EmployeeType";
import { useSelector } from "@/store/hooks";
import { tableFiltersConfig } from "./(list)/FiltersConfig";
import { columnTypeConfig } from "./(list)/ColumnsConfig";
import { useDispatch } from "react-redux";
import { fetchEmployees } from "@/store/employees-incidents/EmployeesIncidentsSlice";
import { updateSearch } from "@/store/tables/FiltersSlice";
import type { AppDispatch } from "@/store/store";
import { header } from "./(list)/Header";
import type { RootState } from "@/store/store";
import PageContainer from "@/app/components/container/PageContainer";
import CustomIncidentStatusComponent from "@/components/customComponents/CustomIncidentStatusComponent";
import { Button } from "@mui/material";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";

const BCrumb = [
  {
    to: "/admin/employees-incidents",
    title: "Incidencias de empleados",
  },
];

export default function EmployeesIncidents() {
  const ENTITY = "employeesIncidents";
  const dispatch = useDispatch<AppDispatch>();
  const { page, limit } = useSelector((state: RootState) => state.pagination);
  const { searchTerm, values } = useSelector(
    (state: RootState) => state.filters.employeesIncidents || { searchTerm: "", values: {} },
  );

  useEffect(() => {
    const queryParams = [];
    if (page) queryParams.push(`page=${page}`);
    if (limit) queryParams.push(`limit=${limit}`);
    if (searchTerm) queryParams.push(`search=${searchTerm}`);

    Object.keys(values).forEach((key) => {
      if (values[key]) queryParams.push(`${key}=${values[key]}`);
    });

    dispatch(fetchEmployees(queryParams.join("&")));
  }, [dispatch, page, limit, searchTerm, values]);

  const items: EmployeeType[] = useSelector((state) => state.employeesIncidentsSlice.employeesIncidents);

  const handleSearch = (searchQuery: string) => {
    dispatch(updateSearch({ entity: ENTITY, searchTerm: searchQuery }));
  };

  const emptyMessage = useSelector((state) => state.employeesIncidentsSlice.emptyMessage);

  const createLink = (
    <Button href="/admin/employees-incidents/create" fullWidth variant="contained" color="primary">
      Crear Incidencia
    </Button>
  );

  return (
    <PageContainer title="Incidencias de empleados" description="Incidencias de empleados">
      <Breadcrumb title="Incidencias de empleados" items={BCrumb} />
      <TableWithPagination
        title=""
        headCells={header}
        items={items}
        columnTypeConfig={columnTypeConfig}
        handleSearch={handleSearch}
        filtersConfig={tableFiltersConfig}
        entity={ENTITY}
        emptyMessage={emptyMessage}
        createLink={createLink}
      >
        <CustomIncidentStatusComponent />
      </TableWithPagination>
    </PageContainer>
  );
}
