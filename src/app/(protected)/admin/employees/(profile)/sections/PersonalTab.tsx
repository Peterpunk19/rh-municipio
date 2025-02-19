"use client";

import * as React from "react";
import Tab from "@/components/shared/Tab";
import { formatDate } from "@/utils/formatter";

const PersonalTab = ({ employeeData }: EmployeePageProps) => {
  const displayData = [
    {
      label: "Nombre completo",
      value: `${employeeData.name} ${employeeData.paternal_last_name} ${employeeData.maternal_last_name}`,
    },
    { label: "Fecha de nacimiento", value: formatDate(employeeData.birthday) },
    { label: "CURP", value: employeeData.curp },
    { label: "RFC", value: employeeData.rfc },
    { label: "Genéro", value: employeeData?.gender?.display_name },
  ];

  return <Tab displayData={displayData} title="Datos personales" />;
};
export default PersonalTab;
