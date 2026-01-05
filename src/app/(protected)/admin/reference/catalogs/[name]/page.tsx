"use client";
import { use, useEffect, useMemo } from "react";
import { notFound } from "next/navigation";
import { useSelector } from "@/store/hooks";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { getHeaderConfig } from "@/app/(protected)/admin/reference/catalogs/[name]/(list)/HeaderConfig";
import { getColumnTypeConfig } from "@/app/(protected)/admin/reference/catalogs/[name]/(list)/ColumnConfig";
import { getTableFiltersConfig } from "@/app/(protected)/admin/reference/catalogs/[name]/(list)/FilterConfigs";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import TableWithPagination from "@/components/tables/TableWithPagination";
import { catalogs } from "@/app/(protected)/admin/reference/catalogs/_config";
import { fetchCatalog } from "@/store/reference/catalogs/CatalogsSlice";
import { Button } from "@mui/material";

export default function Catalog({ params }: { params: Promise<{ name: string }> }) {
  const { name } = use(params);
  const catalogConfig = catalogs[name];
  const dispatch = useDispatch<AppDispatch>();

  if (!catalogConfig) {
    notFound();
  }

  const data = useSelector((state) => state.catalogsList.data);
  const emptyMessage = useSelector((state) => state.catalogsList.emptyMessage);
  const { page, limit } = useSelector((state) => state.pagination);
  const { searchTerm, values } = useSelector((state) => state.filters[name] || { searchTerm: "", values: {} });

  const catalogFetch = useMemo(() => catalogConfig.fetch, [catalogConfig.fetch]);

  useEffect(() => {
    const queryParams = [];
    if (page) queryParams.push(`page=${page}`);
    if (limit) queryParams.push(`limit=${limit}`);
    if (searchTerm) queryParams.push(`search=${searchTerm}`);

    Object.keys(values).forEach((key) => {
      if (values[key]) queryParams.push(`${key}=${values[key]}`);
    });

    dispatch(fetchCatalog(catalogFetch, queryParams.join("&")));
  }, [dispatch, catalogFetch, page, limit, searchTerm, values]);

  const BCrumb = [{ to: "/admin/reference/catalogs", title: "Catálogos" }, { title: catalogConfig.title }];
  const createLink = catalogConfig.canCreate ? (
    <Button href={`/admin/reference/catalogs/${name}/create`} fullWidth variant="contained" color="primary">
      {catalogConfig.textCreate}
    </Button>
  ) : undefined;
  return (
    <PageContainer title={catalogConfig.title} description={catalogConfig.title}>
      <Breadcrumb title={catalogConfig.title} items={BCrumb} />
      <TableWithPagination
        title={catalogConfig.title}
        headCells={getHeaderConfig(name)}
        items={data}
        columnTypeConfig={getColumnTypeConfig(name)}
        filtersConfig={getTableFiltersConfig(name)}
        entity={name}
        emptyMessage={emptyMessage}
        showSearchBar={true}
        createLink={createLink}
      />
    </PageContainer>
  );
}
