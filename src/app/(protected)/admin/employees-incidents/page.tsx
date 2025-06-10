"use client";
import React, { useEffect, useState } from "react";
import TableWithPagination from "@/components/tables/TableWithPagination";
import type { EmployeeType } from "@/types/EmployeeType";
import { useSelector } from "@/store/hooks";
import { tableFiltersConfig } from "./(list)/FiltersConfig";
import { columnTypeConfig } from "./(list)/ColumnsConfig";
import { useDispatch } from "react-redux";
import { fetchEmployees } from "@/store/employees-incidents/EmployeesIncidentsSlice";
import type { AppDispatch } from "@/store/store";
import { header } from "./(list)/Header";
import type { RootState } from "@/store/store";
import PageContainer from "@/app/components/container/PageContainer";
import CustomIncidentStatusComponent from "@/components/customComponents/CustomIncidentStatusComponent";
import { Button } from "@mui/material";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import { IncidentCreateModal } from "./IncidentCreateModal";
import { useCurrentUser } from "@/hooks/use-current-user";

const BCrumb = [
  {
    to: "/admin/employees-incidents",
    title: "Incidencias de empleados",
  },
];

export default function EmployeesIncidents() {
  const ENTITY = "employeesIncidents";
  const dispatch = useDispatch<AppDispatch>();
  const { page, limit } = useSelector((state: RootState) => state.pagination);
  const { searchTerm, values, title, showSearchBar } = useSelector(
    (state: RootState) => state.filters.employeesIncidents || { searchTerm: "", values: {} },
  );
  const { user } = useCurrentUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    const queryParams = [];
    if (page) queryParams.push(`page=${page}`);
    if (limit) queryParams.push(`limit=${limit}`);
    if (searchTerm) queryParams.push(`search=${searchTerm}`);

    Object.keys(values).forEach((key) => {
      if (values[key]) queryParams.push(`${key}=${values[key]}`);
    });

    dispatch(fetchEmployees(queryParams.join("&")));
  }, [dispatch, page, limit, searchTerm, values, refreshKey]);

  const items: EmployeeType[] = useSelector((state) => state.employeesIncidentsSlice.employeesIncidents);

  const emptyMessage = useSelector((state) => state.employeesIncidentsSlice.emptyMessage);

  const createLink = (
    <Button onClick={handleOpenModal} fullWidth variant="contained" color="primary">
      Crear Incidencia
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
        <CustomIncidentStatusComponent />
      </TableWithPagination>
      <IncidentCreateModal
        open={isModalOpen}
        onClose={handleCloseModal}
        employeeId={user?.employee_id}
        onSuccess={handleSuccess}
      />
    </PageContainer>
  );
}
