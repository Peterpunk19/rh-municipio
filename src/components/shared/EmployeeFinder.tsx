"use client";

import React, { useState } from "react";
import CustomAutocompleteSearchField from "@/components/customFields/CustomAutocompleteSearchField";
import CustomLabelError from "@/components/theme-elements/CustomLabelError";
import { Grid2 } from "@mui/material";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import {EmployeeDetailCard} from "@/components/shared/EmployeeDetailCard";

interface EmployeeFinderProps {
  onEmployeeSelect: (employee: any) => void;
  error: string | null;
}

const EmployeeFinder: React.FC<EmployeeFinderProps> = ({ onEmployeeSelect, error }) => {
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  const handleSelectEmployee = (_: any, employee: any | null) => {
    setSelectedEmployee(employee);
    onEmployeeSelect(employee);
  };

  return (
    <Grid2 container spacing={2}>
      <Grid2 size={{ xs: 12 }}>
        <CustomFormLabel sx={{ mb: 2, mt:-2 }}>Empleado</CustomFormLabel>
        <CustomAutocompleteSearchField
          field={{
            url: "/api/employees/autocomplete",
            label: "Ingresa RFC, CURP, Nombre o Número de empleados",
            value: "",
          }}
          handleChange={(_, value) => handleSelectEmployee(_, value)}
        />
        <CustomLabelError field={error} />
      </Grid2>
      <EmployeeDetailCard employee={selectedEmployee} />
    </Grid2>
  );
};

export default EmployeeFinder;
