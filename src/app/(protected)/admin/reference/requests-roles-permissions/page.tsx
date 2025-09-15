"use client";

import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import React, { useEffect } from "react";
import { useSelector } from "@/store/hooks";
import { useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { fetchData } from "@/store/reference/requests-roles-permissions/ListSlice";
import { header } from "@/app/(protected)/admin/reference/requests-roles-permissions/(list)/Header";
import { columnTypeConfig } from "@/app/(protected)/admin/reference/requests-roles-permissions/(list)/ColumnsConfig";
import { tableFiltersConfig } from "@/app/(protected)/admin/reference/requests-roles-permissions/(list)/FiltersConfig";
import TableWithPagination from "@/components/tables/TableWithPagination";

const title = "Permisos de Solicitudes";

const BCrumb = [
  {
    to: "/admin/reference/requests-roles-permissions",
    title: "Listado de Permisos de Solicitudes",
  },
];

export default function RequestsRolesPermissions() {
  const ENTITY = "requestsRolesPermissions";
  const dispatch = useDispatch<AppDispatch>();
  const { page, limit } = useSelector((state: RootState) => state.pagination);
  const { searchTerm, values } = useSelector(
    (state: RootState) => state.filters.requestsRolesPermissions || { searchTerm: "", values: {} },
  );

  const requestsRolesPermissions = useSelector((state: RootState) => state.requestsRolesPermissions.data);
  const emptyMessage = useSelector((state: RootState) => state.requestsRolesPermissions.emptyMessage);

  useEffect(() => {
    const queryParams = [];
    if (page) queryParams.push(`page=${page}`);
    if (limit) queryParams.push(`limit=${limit}`);
    if (searchTerm) queryParams.push(`search=${searchTerm}`);

    Object.keys(values).forEach((key) => {
      if (values[key]) queryParams.push(`${key}=${values[key]}`);
    });

    dispatch(fetchData(queryParams.join("&")));
  }, [dispatch, page, limit, searchTerm, values]);

  return (
    <PageContainer title={title} description={title}>
      <Breadcrumb title={title} items={BCrumb} />
      <TableWithPagination
        title=""
        headCells={header}
        items={requestsRolesPermissions}
        columnTypeConfig={columnTypeConfig}
        filtersConfig={tableFiltersConfig}
        entity={ENTITY}
        emptyMessage={emptyMessage}
      />
    </PageContainer>
  );
}
