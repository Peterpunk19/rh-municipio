"use client";

import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import React, { useEffect } from "react";
import { useSelector } from "@/store/hooks";
import { useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { fetchData } from "@/store/reference/incidents-roles-permissions/ListSlice";
import { header } from "@/app/(protected)/admin/reference/incidents-roles-permissions/(list)/Header";
import { columnTypeConfig } from "@/app/(protected)/admin/reference/incidents-roles-permissions/(list)/ColumnsConfig";
import { tableFiltersConfig } from "@/app/(protected)/admin/reference/incidents-roles-permissions/(list)/FiltersConfig";
import TableWithPagination from "@/components/tables/TableWithPagination";

const title = "Permisos de Incidencias";

const BCrumb = [
  {
    to: "/admin/reference/incidents-roles-permissions",
    title: "Listado de Permisos de Incidencias",
  },
];

export default function IncidentsRolesPermissions() {
  const ENTITY = "incidentsRolesPermissions";
  const dispatch = useDispatch<AppDispatch>();
  const { page, limit } = useSelector((state: RootState) => state.pagination);
  const { searchTerm, values } = useSelector(
    (state: RootState) => state.filters.incidentsRolesPermissions || { searchTerm: "", values: {} },
  );

  const incidentsRolesPermissions = useSelector((state) => state.incidentsRolesPermissions.data);

  const emptyMessage = useSelector((state) => state.incidentsRolesPermissions.emptyMessage);

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
        items={incidentsRolesPermissions}
        columnTypeConfig={columnTypeConfig}
        filtersConfig={tableFiltersConfig}
        entity={ENTITY}
        emptyMessage={emptyMessage}
      />
    </PageContainer>
  );
}
