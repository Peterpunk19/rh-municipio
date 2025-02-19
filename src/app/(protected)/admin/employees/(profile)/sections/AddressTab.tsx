"use client";

import * as React from "react";
import { Grid2 as Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import Tab from "@/components/shared/Tab";

const AddressTab = ({ employeeData }: EmployeePageProps) => {
  const displayData = [
    {
      label: "Calle",
      value: employeeData?.employee_address[0]?.address_line_1,
    },
    {
      label: "Número exterior",
      value: employeeData?.employee_address[0]?.address_line_2,
    },
    {
      label: "Número interior",
      value: employeeData?.employee_address[0]?.address_line_3,
    },
    {
      label: "Colonia",
      value: employeeData?.employee_address[0]?.address_line_4,
    },
    {
      label: "Código postal",
      value: employeeData?.employee_address[0]?.postal_code,
    },
    {
      label: "Municipio",
      value: employeeData?.employee_address[0]?.municipality?.display_name,
    },
    {
      label: "Estado",
      value: employeeData?.employee_address[0]?.municipality?.state?.display_name,
    },
  ];

  return <Tab displayData={displayData} title="Datos de domicilio" />;
};
export default AddressTab;
