import React from "react";
import EmployeesPayroll from "@/app/(protected)/admin/employees-payroll/EmployeesPayroll";

export default function Page() {
  const employeeData = null;
  const actionButtons = { downloadPdf: true, createAttendance: false };
  const showSearchBar = true;

  return <EmployeesPayroll employeeData={employeeData} actionButtons={actionButtons} showSearchBar={showSearchBar} />;
}
