"use client";
import React, { useEffect } from "react";
import TableWithPagination from "@/components/tables/TableWithPagination";
import type { EmployeeRequestType } from "@/types/EmployeeRequestType";
import { useSelector } from "@/store/hooks";
import { tableFiltersConfig } from "./(list)/FiltersConfig";
import { columnTypeConfig } from "./(list)/ColumnsConfig";
import { useDispatch } from "react-redux";
import { fetchEmployeeRequests } from "@/store/employees-requests/EmployeesRequestsFiltersSlice";
import type { AppDispatch } from "@/store/store";
import { header } from "./(list)/Header";
import type { RootState } from "@/store/store";
import PageContainer from "@/app/components/container/PageContainer";
import CustomRequestStatusComponent from "@/components/customComponents/CustomRequestStatusComponent";
import { Button } from "@mui/material";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import { formatDateStringFilters } from "@/utils/formatter";

const BCrumb = [
  {
    to: "/admin/employees-requests",
    title: "Solicitudes de empleados",
  },
];

export default function EmployeeRequests() {
  const ENTITY = "employeeRequests";
  const dispatch = useDispatch<AppDispatch>();

  const { page, limit } = useSelector((state: RootState) => state.pagination);
  const { searchTerm, values, title, showSearchBar } = useSelector(
    (state: RootState) => state.filters.employeeRequests || { searchTerm: "", values: {} },
  );

  useEffect(() => {
    const fetchData = async () => {
      const queryParams = [];
      if (page) queryParams.push(`page=${page}`);
      if (limit) queryParams.push(`limit=${limit}`);
      if (searchTerm) queryParams.push(`search=${searchTerm}`);

      Object.keys(values || {}).forEach((key) => {
        if (values[key]) {
          if ((key === "created_at" || key === "request_date") && values[key]) {
            const formattedDate = formatDateStringFilters(values[key]);
            if (formattedDate) {
              queryParams.push(`${key}=${formattedDate}`);
            }
          } else {
            queryParams.push(`${key}=${values[key]}`);
          }
        }
      });

      await dispatch(fetchEmployeeRequests(queryParams.join("&")));
    };

    fetchData();
  }, [dispatch, page, limit, searchTerm, values]);

  const items: EmployeeRequestType[] = useSelector(
    (state: RootState) => state.employeeRequestsSlice?.employeeRequests || [],
  );

  const emptyMessage = useSelector(
    (state: RootState) => state.employeeRequestsSlice?.emptyMessage || "No hay solicitudes disponibles",
  );

  const createLink = (
    <Button href="/admin/employees-requests/create" fullWidth variant="contained" color="primary">
      Crear Solicitud
    </Button>
  );

  return (
    <PageContainer title={title} description={title}>
      {showSearchBar ?? <Breadcrumb title={title} items={BCrumb} />}
      <TableWithPagination
        title=""
        headCells={header}
        items={items}
        columnTypeConfig={columnTypeConfig}
        filtersConfig={tableFiltersConfig}
        entity={ENTITY}
        emptyMessage={emptyMessage}
        createLink={createLink}
      >
        <CustomRequestStatusComponent />
      </TableWithPagination>
    </PageContainer>
  );
}
