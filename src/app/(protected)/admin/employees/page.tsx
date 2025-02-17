"use client";
import React, { useEffect } from "react";
import TableWithPagination from "@/components/tables/TableWithPagination";
import { EmployeeType } from "@/types/EmployeeType";
import { useSelector } from "@/store/hooks";
import { getFiltersConfig } from "./(list)/FiltersConfig";
import { columnTypeConfig } from "./(list)/ColumnsConfig";
import { useDispatch } from "react-redux";
import { fetchEmployees } from "@/store/employees/EmployeesFiltersSlice";
import { updateSearch } from "@/store/tables/FiltersSlice";
import { AppDispatch } from "@/store/store";
import { header } from "./(list)/Header";
import { RootState } from "@/store/store";
import PageContainer from "@/app/components/container/PageContainer";

export default function Employees() {
  const dispatch = useDispatch<AppDispatch>();
  const { page, limit } = useSelector((state: RootState) => state.pagination);
  const { search } = useSelector((state: RootState) => state.filters);

  const { values } = useSelector((state: RootState) => state.filters);

  useEffect(() => {
    const queryParams = [];
    if (page) queryParams.push(`page=${page}`);
    if (limit) queryParams.push(`limit=${limit}`);
    if (search) queryParams.push(`search=${search}`);

    Object.keys(values).forEach((key) => {
      if (values[key]) queryParams.push(`${key}=${values[key]}`);
    });

    dispatch(fetchEmployees(queryParams.join("&")));
  }, [dispatch, page, limit, search, values]);

  const items: EmployeeType[] = useSelector((state) => state.filterEmployeesSlice.employees);

  const handleSearch = (searchQuery: string) => {
    dispatch(updateSearch(searchQuery));
  };

  return (
    <PageContainer title="Basic Table" description="this is Basic Table">
      <TableWithPagination
        title="Empleados"
        headCells={header}
        items={items}
        columnTypeConfig={columnTypeConfig}
        handleSearch={handleSearch}
        filtersConfig={getFiltersConfig}
      />
    </PageContainer>
  );
}
