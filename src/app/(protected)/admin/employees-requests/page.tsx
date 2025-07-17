"use client";
import React, { useEffect, useState } from "react";
import TableWithPagination from "@/components/tables/TableWithPagination";
import type { EmployeeRequestType } from "@/types/EmployeeRequestType";
import { useSelector } from "@/store/hooks";
import { tableFiltersConfig } from "./(list)/FiltersConfig";
import { columnTypeConfig } from "./(list)/ColumnsConfig";
import { useDispatch } from "react-redux";
import { fetchEmployeeRequests } from "@/store/employees-requests/EmployeesRequestsFiltersSlice";
import type { AppDispatch } from "@/store/store";
import type { RootState } from "@/store/store";
import PageContainer from "@/app/components/container/PageContainer";
import CustomRequestStatusComponent from "@/components/customComponents/CustomRequestStatusComponent";
import { Button } from "@mui/material";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import { formatDateStringFilters } from "@/utils/formatter";
import RequestCreateModal from "./RequestCreateModal";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ROLES } from "@/common/constants/Roles";
import { header as adminHeader } from "@/app/(protected)/admin/employees-requests/(list)/Header";
import { HeadCell } from "@/interfaces/HeadCell";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import RequestDetailModal from "@/app/(protected)/employee/requests/RequestDetailModal";

const BCrumb = [
  {
    to: "/admin/employees-requests",
    title: "Solicitudes de empleados",
  },
];

export default function EmployeeRequests({
  role = ROLES.ADMIN,
  header = adminHeader,
}: {
  role?: string;
  header?: readonly HeadCell[];
}) {
  const ENTITY = "employeeRequests";
  const dispatch = useDispatch<AppDispatch>();

  const { page, limit } = useSelector((state: RootState) => state.pagination);
  const { searchTerm, values, title, showSearchBar } = useSelector(
    (state: RootState) => state.filters.employeeRequests || { searchTerm: "", values: {} },
  );
  const { user } = useCurrentUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleOpenDetailModal = (incidentId: string) => {
    setSelectedIncident(incidentId);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedIncident(null);
  };

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
  }, [dispatch, page, limit, searchTerm, values, refreshKey]);

  const items: EmployeeRequestType[] = useSelector(
    (state: RootState) => state.employeeRequestsSlice?.employeeRequests || [],
  );

  const emptyMessage = useSelector(
    (state: RootState) => state.employeeRequestsSlice?.emptyMessage || "No hay solicitudes disponibles",
  );

  const createLink = (
    <Button
      {...(role === ROLES.ADMIN ? { href: "/admin/employees-requests/create" } : { onClick: handleOpenModal })}
      fullWidth
      variant="contained"
      color="primary"
    >
      Crear Solicitud
    </Button>
  );

  return (
    <PageContainer title={title} description={title}>
      {showSearchBar && <Breadcrumb title={title} items={BCrumb} />}
      <TableWithPagination
        title=""
        headCells={header}
        items={items}
        columnTypeConfig={columnTypeConfig}
        filtersConfig={tableFiltersConfig}
        entity={ENTITY}
        emptyMessage={emptyMessage}
        createLink={createLink}
        onRowDetailClick={handleOpenDetailModal}
      >
        <CustomRequestStatusComponent />
      </TableWithPagination>
      <RequestCreateModal
        open={isModalOpen}
        onClose={handleCloseModal}
        employeeId={user?.employee_id}
        onSuccess={handleSuccess}
      />
      {selectedIncident && (
        <Dialog open={isDetailModalOpen} onClose={handleCloseDetailModal} fullWidth maxWidth="md">
          <DialogTitle id="alert-dialog-title">Detalle de solicitud</DialogTitle>
          <DialogContent>
            <RequestDetailModal id={selectedIncident} />
          </DialogContent>
        </Dialog>
      )}
    </PageContainer>
  );
}
