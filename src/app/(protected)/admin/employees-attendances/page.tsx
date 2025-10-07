import React from "react";
import EmployeesAttendances from "@/app/(protected)/admin/employees-attendances/EmployeeAttendance";

export default function Page() {
  const employeeData = null; // o fetch desde prisma
  const actionButtons = { downloadPdf: true, createAttendance: false };
  const showSearchBar = true;

  return (
    <EmployeesAttendances employeeData={employeeData} actionButtons={actionButtons} showSearchBar={showSearchBar} />
  );
}
