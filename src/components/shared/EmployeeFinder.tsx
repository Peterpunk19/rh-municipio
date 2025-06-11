"use client";

import React, { useState, useEffect } from "react";
import CustomAutocompleteSearchField from "@/components/customFields/CustomAutocompleteSearchField";
import CustomLabelError from "@/components/theme-elements/CustomLabelError";
import { Grid2 } from "@mui/material";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import { EmployeeDetailCard } from "@/components/shared/EmployeeDetailCard";

interface EmployeeFinderProps {
  onEmployeeSelect: (employee: any) => void;
  error: string | null;
  label?: string;
  initialEmployee?: any;
}

const EmployeeFinder: React.FC<EmployeeFinderProps> = ({
  onEmployeeSelect,
  error,
  label = "Empleado",
  initialEmployee = null,
}) => {
  const [selectedEmployee, setSelectedEmployee] = useState<any>(initialEmployee);

  const handleSelectEmployee = (_: React.SyntheticEvent<Element, Event> | null, employee: any) => {
    setSelectedEmployee(employee);
    onEmployeeSelect(employee);
  };

  useEffect(() => {
    if (initialEmployee) {
      setSelectedEmployee(initialEmployee);
    }
  }, [initialEmployee]);

  return (
    <Grid2 container spacing={2}>
      <Grid2 size={{ xs: 12 }}>
        <CustomFormLabel sx={{ mb: 2, mt: -2 }}>{label}</CustomFormLabel>
        <CustomAutocompleteSearchField
          field={{
            url: "/api/employees/autocomplete",
            label: "Ingresa RFC, CURP, Nombre o Número de empleados",
            value: initialEmployee ? initialEmployee.label : "",
          }}
          initialOption={initialEmployee}
          handleChange={(event, value) => {
            if (value) {
              handleSelectEmployee(event, value);
            } else {
              handleSelectEmployee(event, null);
            }
          }}
        />
        <CustomLabelError field={error} />
      </Grid2>
      <EmployeeDetailCard employee={selectedEmployee} />
    </Grid2>
  );
};

export default EmployeeFinder;
