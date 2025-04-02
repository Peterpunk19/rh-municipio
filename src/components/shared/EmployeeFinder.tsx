"use client";

import React, { useState, useEffect } from "react";
import CustomAutocompleteSearchField from "@/components/customFields/CustomAutocompleteSearchField";
import CustomLabelError from "@/components/theme-elements/CustomLabelError";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import { FormControl, Grid2 } from "@mui/material";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";

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
      {selectedEmployee && (
        <>
          <Grid2 size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <CustomFormLabel sx={{ mb: 1, mt:0 }}>Número de Empleado</CustomFormLabel>
              <CustomTextField value={selectedEmployee.number_employee} variant="outlined" fullWidth disabled />
            </FormControl>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <CustomFormLabel sx={{ mb: 1, mt:0 }}>Nombre</CustomFormLabel>
              <CustomTextField value={selectedEmployee.label} variant="outlined" fullWidth disabled />
            </FormControl>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <CustomFormLabel sx={{ mb: 1, mt:0 }}>RFC</CustomFormLabel>
              <CustomTextField value={selectedEmployee.rfc} variant="outlined" fullWidth disabled />
            </FormControl>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <CustomFormLabel sx={{ mb: 1, mt:0 }}>CURP</CustomFormLabel>
              <CustomTextField value={selectedEmployee.curp} variant="outlined" fullWidth disabled />
            </FormControl>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <CustomFormLabel sx={{ mb: 1, mt:0 }}>Organismo público</CustomFormLabel>
              <CustomTextField
                value={selectedEmployee.secretaria_display_name}
                variant="outlined"
                fullWidth
                disabled
              />
            </FormControl>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <CustomFormLabel sx={{ mb: 1, mt:0 }}>Organismo administrativo</CustomFormLabel>
              <CustomTextField
                value={selectedEmployee.direccion_display_name}
                variant="outlined"
                fullWidth
                disabled
              />
            </FormControl>
          </Grid2>
          {selectedEmployee?.trade_union_display_name && (
            <Grid2 size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <CustomFormLabel sx={{ mb: 1, mt:0 }}>Sindicato</CustomFormLabel>
                <CustomTextField
                  value={selectedEmployee.trade_union_display_name}
                  variant="outlined"
                  fullWidth
                  disabled
                />
              </FormControl>
            </Grid2>
          )}
          <Grid2 size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <CustomFormLabel sx={{ mb: 1, mt:0 }}>Tipo de empleado</CustomFormLabel>
              <CustomTextField
                value={selectedEmployee.employee_type_display_name}
                variant="outlined"
                fullWidth
                disabled
              />
            </FormControl>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <CustomFormLabel sx={{ mb: 1, mt:0 }}>Categoría</CustomFormLabel>
              <CustomTextField
                value={selectedEmployee.category_display_name}
                variant="outlined"
                fullWidth
                disabled
              />
            </FormControl>
          </Grid2>
        </>
      )}
    </Grid2>
  );
};

export default EmployeeFinder;
