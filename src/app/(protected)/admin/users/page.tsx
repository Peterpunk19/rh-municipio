"use client";
import React, { useEffect } from "react";
import TableWithPagination from "@/components/tables/TableWithPagination";
import type { UserType } from "@/types/UserType";
import { useSelector } from "@/store/hooks";
import { getFiltersConfig } from "./(list)/FiltersConfig";
import { columnTypeConfig } from "./(list)/ColumnsConfig";
import { useDispatch } from "react-redux";
import { fetchUsers } from "@/store/users/UsersFiltersSlice";
import { updateSearch } from "@/store/tables/FiltersSlice";
import type { AppDispatch } from "@/store/store";
import { header } from "./(list)/Headers";
import type { RootState } from "@/store/store";
import PageContainer from "@/app/components/container/PageContainer";

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

  const handleSearch = (searchQuery: string) => {
    dispatch(updateSearch({ entity: "user", searchTerm: searchQuery }));
  };
  const emptyMessage = useSelector((state) => state.filterUsersSlice.emptyMessage);

  return (
    <PageContainer title="Lista de usuarios" description="Tabla de usuarios">
      <TableWithPagination
        title="Usuarios"
        headCells={header}
        items={items}
        columnTypeConfig={columnTypeConfig}
        handleSearch={handleSearch}
        filtersConfig={getFiltersConfig}
        entity="user"
        emptyMessage={emptyMessage}
      />
    </PageContainer>
  );
}
