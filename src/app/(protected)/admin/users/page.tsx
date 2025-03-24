"use client";
import React, { useEffect } from "react";
import TableWithPagination from "@/components/tables/TableWithPagination";
import type { UserType } from "@/types/UserType";
import { useSelector } from "@/store/hooks";
import { getFiltersConfig } from "./(list)/FiltersConfig";
import { columnTypeConfig } from "./(list)/ColumnsConfig";
import { useDispatch } from "react-redux";
import { fetchUsers } from "@/store/users/UsersFiltersSlice";
import type { AppDispatch } from "@/store/store";
import { header } from "./(list)/Headers";
import type { RootState } from "@/store/store";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import { Button } from "@mui/material";

const BCrumb = [
  {
    title: "Listado de usuarios",
  },
];

export default function Users() {
  const dispatch = useDispatch<AppDispatch>();
  const { page, limit } = useSelector((state: RootState) => state.pagination);
  const { searchTerm, values } = useSelector(
    (state: RootState) => state.filters.user || { searchTerm: "", values: {} },
  );

  useEffect(() => {
    const queryParams = [];
    if (page) queryParams.push(`page=${page}`);
    if (limit) queryParams.push(`limit=${limit}`);
    if (searchTerm) queryParams.push(`search=${searchTerm.trim()}`);

    Object.keys(values).forEach((key) => {
      if (values[key]) queryParams.push(`${key}=${values[key]}`);
    });

    dispatch(fetchUsers(queryParams.join("&")));
  }, [dispatch, page, limit, searchTerm, values]);

  const items: UserType[] = useSelector((state) => state.filterUsersSlice.users);

  const emptyMessage = useSelector((state) => state.filterUsersSlice.emptyMessage);

  const createLink = (
    <Button href="/admin/users/create" fullWidth variant="contained" color="primary">
      Crear usuario
    </Button>
  );

  return (
    <PageContainer title="Lista de usuarios" description="Tabla de usuarios">
      <Breadcrumb title="Listado de usuarios" items={BCrumb} />
      <TableWithPagination
        title="Usuarios"
        headCells={header}
        items={items}
        columnTypeConfig={columnTypeConfig}
        filtersConfig={getFiltersConfig}
        entity="user"
        emptyMessage={emptyMessage}
        createLink={createLink}
      />
    </PageContainer>
  );
}
