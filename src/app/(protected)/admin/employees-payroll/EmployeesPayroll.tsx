"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import TableWithPagination from "@/components/tables/TableWithPagination";
import type { EmployeeType } from "@/types/EmployeeType";
import { useSelector } from "@/store/hooks";
import { tableFiltersConfig } from "./(list)/FiltersConfig";
import { columnTypeConfig } from "./(list)/ColumnsConfig";
import { useDispatch } from "react-redux";
import { fetchEmployees } from "@/store/employees-payroll/EmployeesPayrollSlice";
import type { AppDispatch, RootState } from "@/store/store";
import { header } from "./(list)/Header";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import { formatDate } from "@/utils/formatter";

const BCrumb = [
  {
    to: "/admin/employees-payroll",
    title: "Nómina de empleados",
  },
];

const EmployeesPayroll = ({
  employeeData = null,
  actionButtons = { downloadPdf: false, createAttendance: true },
  showSearchBar,
}: {
  employeeData?: EmployeePageProps | null;
  actionButtons?: { downloadPdf: boolean; createAttendance: boolean };
  showSearchBar?: boolean;
}) => {
  const ENTITY = "employeesPayroll";
  const dispatch = useDispatch<AppDispatch>();
  const { page, limit } = useSelector((state: RootState) => state.pagination);

  const {
    searchTerm,
    values,
    title,
    showSearchBar: showSearchBarFromRedux,
  } = useSelector((state: RootState) => state.filters.employeesPayroll || { searchTerm: "", values: {} });
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

  const items: EmployeeType[] = useSelector((state) => state.employeesPayrollSlice.employeesPayroll);

  const emptyMessage = useSelector((state) => state.employeesPayrollSlice.emptyMessage);

  return (
    <PageContainer title="Nómina de empleados" description="Nómina de empleados">
      {enableShowSearchBar && <Breadcrumb title={title} items={BCrumb} />}
      <TableWithPagination
        title=""
        headCells={header}
        items={items}
        columnTypeConfig={columnTypeConfig}
        filtersConfig={tableFiltersConfig}
        entity={ENTITY}
        emptyMessage={emptyMessage}
        showSearchBar={showSearchBar}
        border={true}
      />
    </PageContainer>
  );
};

export default EmployeesPayroll;
