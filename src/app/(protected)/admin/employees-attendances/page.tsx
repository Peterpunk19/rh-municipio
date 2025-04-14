"use client";
import React, { useEffect } from "react";
import TableWithPagination from "@/components/tables/TableWithPagination";
import type { EmployeeType } from "@/types/EmployeeType";
import { useSelector } from "@/store/hooks";
import { tableFiltersConfig } from "./(list)/FiltersConfig";
import { columnTypeConfig } from "./(list)/ColumnsConfig";
import { useDispatch } from "react-redux";
import { fetchEmployees } from "@/store/employees-attendances/EmployeesAttendancesSlice";
import type { AppDispatch, RootState } from "@/store/store";
import { header } from "./(list)/Header";
import PageContainer from "@/app/components/container/PageContainer";
import { Button } from "@mui/material";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";

const BCrumb = [
  {
    to: "/admin/employees-attendances",
    title: "Asistencias de empleados",
  },
];

export default function EmployeesAttendances() {
  const ENTITY = "employeesAttendances";
  const dispatch = useDispatch<AppDispatch>();
  const { page, limit } = useSelector((state: RootState) => state.pagination);
  const { searchTerm, values } = useSelector(
    (state: RootState) => state.filters.employeesAttendances || { searchTerm: "", values: {} },
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

  const items: EmployeeType[] = useSelector((state) => state.employeesAttendancesSlice.employeesAttendances);

  const emptyMessage = useSelector((state) => state.employeesAttendancesSlice.emptyMessage);

  const createLink = (
    <Button href="/admin/employees-attendances/create" fullWidth variant="contained" color="primary">
      Crear asistencia manual
    </Button>
  );

  return (
    <PageContainer title="Asistencias de empleados" description="Asistencias de empleados">
      <Breadcrumb title="Asistencias de empleados" items={BCrumb} />
      <TableWithPagination
        title=""
        headCells={header}
        items={items}
        columnTypeConfig={columnTypeConfig}
        filtersConfig={tableFiltersConfig}
        entity={ENTITY}
        emptyMessage={emptyMessage}
        createLink={createLink}
      />
    </PageContainer>
  );
}
