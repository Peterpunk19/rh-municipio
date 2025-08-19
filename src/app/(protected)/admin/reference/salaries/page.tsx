"use client";

import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import React, { useEffect } from "react";
import { useSelector } from "@/store/hooks";
import { useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { header } from "@/app/(protected)/admin/reference/salaries/(list)/Header";
import { columnTypeConfig } from "@/app/(protected)/admin/reference/salaries/(list)/ColumnsConfig";
import { tableFiltersConfig } from "@/app/(protected)/admin/reference/salaries/(list)/FiltersConfig";
import TableWithPagination from "@/components/tables/TableWithPagination";
import { fetchData } from "@/store/reference/salaries/ListSlice";

const title = "Salarios";

const BCrumb = [
  {
    to: "/admin/reference/salaries",
    title: "Listado de Salarios",
  },
];

export default function Salaries() {
  const ENTITY = "salaries";
  const dispatch = useDispatch<AppDispatch>();
  const { page, limit } = useSelector((state: RootState) => state.pagination);
  const { searchTerm, values } = useSelector(
    (state: RootState) => state.filters.salaries || { searchTerm: "", values: {} },
  );

  const salaries = useSelector((state) => state.salaries.salaries);

  const emptyMessage = useSelector((state) => state.salaries.emptyMessage);

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
        items={salaries}
        columnTypeConfig={columnTypeConfig}
        filtersConfig={tableFiltersConfig}
        entity={ENTITY}
        emptyMessage={emptyMessage}
      />
    </PageContainer>
  );
}
