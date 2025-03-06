"use client";

import * as React from "react";
import Tab from "@/components/shared/tabs/Tab";
import { formatDate } from "@/utils/formatter";

const HiringTab = ({ employeeData }: EmployeePageProps) => {
  const displayData = [
    { label: "Estatus", value: employeeData?.status_employee?.display_name },
    { label: "Ubicación", value: employeeData?.employee_location[0]?.location?.display_name },
    {
      label: "Fecha de ingreso",
      value: formatDate(employeeData?.employee_hiring[0]?.start_job_date),
    },
    {
      label: "Fecha de finalización",
      value: formatDate(employeeData?.employee_hiring[0]?.end_job_date),
    },
    { label: "Categoría", value: employeeData?.employee_hiring[0]?.category?.display_name },
    { label: "Tipo", value: employeeData?.employee_hiring[0]?.employee_type?.display_name },
    { label: "Sindicato", value: employeeData?.employee_trade_union[0]?.trade_union?.display_name },
  ];

  return <Tab displayData={displayData} title="Datos de contratación" />;
};
export default HiringTab;
