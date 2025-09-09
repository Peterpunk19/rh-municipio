"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import TableWithPagination from "@/components/tables/TableWithPagination";
import type { EmployeeType } from "@/types/EmployeeType";
import { useSelector } from "@/store/hooks";
import { tableFiltersConfig } from "./(list)/FiltersConfig";
import { columnTypeConfig } from "./(list)/ColumnsConfig";
import { useDispatch } from "react-redux";
import { fetchEmployees } from "@/store/employees-attendances/EmployeesAttendancesSlice";
import type { AppDispatch, RootState } from "@/store/store";
import { header } from "./(list)/Header";
import PageContainer from "@/app/components/container/PageContainer";
import { Button } from "@mui/material";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import PDFGenerator from "@/components/shared/pdfs/PDFGenerator";
import AttendanceReportTemplate from "@/components/shared/pdfs/templates/AttendanceReportTemplate";
import { normalizeText } from "@/common/utils";

const BCrumb = [
  {
    to: "/admin/employees-attendances",
    title: "Asistencias de empleados",
  },
];

export default function EmployeesAttendances({
  employeeData = null,
  actionButtons = { downloadPdf: false, createAttendance: true },
  showSearchBar,
}: {
  employeeData?: EmployeePageProps | null;
  actionButtons?: { downloadPdf: boolean; createAttendance: boolean };
  showSearchBar?: boolean;
}) {
  const ENTITY = "employeesAttendances";
  const dispatch = useDispatch<AppDispatch>();
  const { page, limit } = useSelector((state: RootState) => state.pagination);
  const {
    searchTerm,
    values,
    title,
    showSearchBar: showSearchBarFromRedux,
  } = useSelector((state: RootState) => state.filters.employeesAttendances || { searchTerm: "", values: {} });
  const enableShowSearchBar = typeof showSearchBar === "boolean" ? showSearchBar : showSearchBarFromRedux;
  const { id: employeeId } = useParams();

  useEffect(() => {
    const queryParams = [];
    if (page) queryParams.push(`page=${page}`);
    if (limit) queryParams.push(`limit=${limit}`);
    if (searchTerm) queryParams.push(`search=${searchTerm}`);
    if (employeeId) queryParams.push(`employeeId=${employeeId}`);

    Object.keys(values).forEach((key) => {
      if (values[key]) queryParams.push(`${key}=${values[key]}`);
    });

    const queryString = queryParams.join("&");
    dispatch(fetchEmployees(queryString));
  }, [dispatch, page, limit, searchTerm, values, employeeId]);

  const items: EmployeeType[] = useSelector((state) => state.employeesAttendancesSlice.employeesAttendances);

  const emptyMessage = useSelector((state) => state.employeesAttendancesSlice.emptyMessage);

  const createLink = (
    <>
      {actionButtons.downloadPdf && (
        <PDFGenerator
          data={{ items, employeeData }}
          title="REPORTE DE ASISTENCIAS"
          template={AttendanceReportTemplate as any}
          fileName={(() => {
            const first: any = (items as any)?.[0] || {};
            const name = first?.employee?.fullName || "reporte_asistencias";
            return normalizeText(name);
          })()}
          optionsConfig={{ displayMode: "button" }}
          buttonLabel="Descargar reporte"
          buttonProps={{ variant: "contained", color: "primary", startIcon: "", sx: { mb: 1 } }}
        />
      )}
      {actionButtons.createAttendance && (
        <Button href="/admin/employees-attendances/create" fullWidth variant="contained" color="primary">
          Crear asistencia manual
        </Button>
      )}
    </>
  );

  return (
    <PageContainer title="Asistencias de empleados" description="Asistencias de empleados">
      {enableShowSearchBar && <Breadcrumb title={title} items={BCrumb} />}
      <TableWithPagination
        title=""
        headCells={header}
        items={items}
        columnTypeConfig={columnTypeConfig}
        filtersConfig={tableFiltersConfig}
        entity={ENTITY}
        emptyMessage={emptyMessage}
        createLink={createLink}
        showSearchBar={showSearchBar}
      />
    </PageContainer>
  );
}
