"use client";
import React, { useEffect } from "react";
import TableWithPagination from "@/components/tables/TableWithPagination";
import type { EmployeeType } from "@/types/EmployeeType";
import { useSelector } from "@/store/hooks";
import { tableFiltersConfig } from "./(list)/FiltersConfig";
import { columnTypeConfig } from "./(list)/ColumnsConfig";
import { useDispatch } from "react-redux";
import { fetchEmployees } from "@/store/employees/EmployeesFiltersSlice";
import { updateSearch } from "@/store/tables/FiltersSlice";
import type { AppDispatch } from "@/store/store";
import { header } from "./(list)/Header";
import type { RootState } from "@/store/store";
import PageContainer from "@/app/components/container/PageContainer";

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

  const handleSearch = (searchQuery: string) => {
    dispatch(updateSearch({ entity: "employee", searchTerm: searchQuery }));
  };
  const emptyMessage = useSelector((state) => state.filterEmployeesSlice.emptyMessage);

  return (
    <PageContainer title="Empleados" description="Listado de empleados">
      <TableWithPagination
        title="Empleados"
        headCells={header}
        items={items}
        columnTypeConfig={columnTypeConfig}
        handleSearch={handleSearch}
        filtersConfig={tableFiltersConfig}
        entity="employee"
        emptyMessage={emptyMessage}
      />
    </PageContainer>
  );
}
