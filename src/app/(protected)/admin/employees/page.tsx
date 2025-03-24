"use client";
import React, { useEffect } from "react";
import TableWithPagination from "@/components/tables/TableWithPagination";
import type { EmployeeType } from "@/types/EmployeeType";
import { useSelector } from "@/store/hooks";
import { tableFiltersConfig } from "./(list)/FiltersConfig";
import { columnTypeConfig } from "./(list)/ColumnsConfig";
import { useDispatch } from "react-redux";
import { fetchEmployees } from "@/store/employees/EmployeesFiltersSlice";
import type { AppDispatch } from "@/store/store";
import { header } from "./(list)/Header";
import type { RootState } from "@/store/store";
import PageContainer from "@/app/components/container/PageContainer";
import { Button } from "@mui/material";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";

const BCrumb = [
  {
    title: "Listado de empleados",
  },
];

export default function Employees() {
  const dispatch = useDispatch<AppDispatch>();
  const { page, limit } = useSelector((state: RootState) => state.pagination);
  const { searchTerm, values } = useSelector(
    (state: RootState) => state.filters.employee || { searchTerm: "", values: {} },
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

  const items: EmployeeType[] = useSelector((state) => state.filterEmployeesSlice.employees);

  const emptyMessage = useSelector((state) => state.filterEmployeesSlice.emptyMessage);

  const createLink = (
    <Button href="/admin/employees/create" fullWidth variant="contained" color="primary">
      Crear Empleado
    </Button>
  );

  return (
    <PageContainer title="Listado de empleados" description="Listado de empleados">
      <Breadcrumb title="Listado de empleados" items={BCrumb} />
      <TableWithPagination
        title="Empleados"
        headCells={header}
        items={items}
        columnTypeConfig={columnTypeConfig}
        filtersConfig={tableFiltersConfig}
        entity="employee"
        emptyMessage={emptyMessage}
        createLink={createLink}
      />
    </PageContainer>
  );
}
