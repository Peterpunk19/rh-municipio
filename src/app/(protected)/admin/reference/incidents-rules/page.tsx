"use client";

import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import React, { useEffect } from "react";
import { useSelector } from "@/store/hooks";
import { useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { fetchData } from "@/store/reference/incidents-rules/ListSlice";
import { header } from "@/app/(protected)/admin/reference/incidents-rules/(list)/Header";
import { columnTypeConfig } from "@/app/(protected)/admin/reference/incidents-rules/(list)/ColumnsConfig";
import { tableFiltersConfig } from "@/app/(protected)/admin/reference/incidents-rules/(list)/FiltersConfig";
import TableWithPagination from "@/components/tables/TableWithPagination";

const title = "Lineamientos de Incidencias";

const BCrumb = [
  {
    to: "/admin/reference/incidents-rules",
    title: "Lineamientos de Incidencias",
  },
];

export default function IncidentsRules() {
  const ENTITY = "incidentsRules";
  const dispatch = useDispatch<AppDispatch>();
  const { page, limit } = useSelector((state: RootState) => state.pagination);
  const { searchTerm, values } = useSelector(
    (state: RootState) => state.filters.incidentsRules || { searchTerm: "", values: {} },
  );

  const incidentsRules = useSelector((state) => state.incidentsRules.data);

  const emptyMessage = useSelector((state) => state.incidentsRules.emptyMessage);

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
        items={incidentsRules}
        columnTypeConfig={columnTypeConfig}
        filtersConfig={tableFiltersConfig}
        entity={ENTITY}
        emptyMessage={emptyMessage}
      />
    </PageContainer>
  );
}
