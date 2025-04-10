"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, FormControl, Grid2, Radio, RadioGroup, FormControlLabel, Typography } from "@mui/material";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomLabelError from "@/components/theme-elements/CustomLabelError";
import { updateFormData } from "@/store/employees-requests/CreateEmployeeRequest";
import { useFetchOptions } from "@/components/customHooks/useFetchOptions";
import { fetchCatalogData } from "@/services/catalogs";
import type { RootState } from "@/store/store";

const AttendanceTypeForm = () => {
  const dispatch = useDispatch();
  const { formData, errors, employeeData } = useSelector((state: RootState) => state.createEmployeeRequest);

  const catalogName = "attendance";
  const fetchData = React.useCallback(() => fetchCatalogData(catalogName), []);
  const { options: attendanceTypes, isLoading, error } = useFetchOptions(fetchData);

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    dispatch(updateFormData({ field: `attendanceTypeForm.${name}`, value }));
  };

  return (
    <Box>
      <Grid2 container spacing={2}>
        <Grid2 size={12}>
          <CustomFormLabel sx={{ mt: 0 }}>Tipo de checado actual</CustomFormLabel>
          <Typography variant="body1" gutterBottom>
            {employeeData?.attendance_type_display_name ? employeeData?.attendance_type_display_name : "No asignado"}
          </Typography>
        </Grid2>
      </Grid2>
      <Grid2 container spacing={1} sx={{ mt: 1 }}>
        <Grid2 size={{ xs: 12, md: 12 }}>
          <CustomFormLabel> Nuevo Tipo de Checado</CustomFormLabel>

          {!isLoading && error ? (
            <Typography variant="body1" gutterBottom>
              Error al cargar los tipos de checado
            </Typography>
          ) : (
            <FormControl component="fieldset">
              <RadioGroup
                row
                name="attendanceType"
                value={formData.attendanceTypeForm.attendanceType}
                onChange={handleChange}
              >
                {attendanceTypes.map((attendanceType) => (
                  <FormControlLabel
                    key={`attendance-${attendanceType.id}`}
                    value={attendanceType.id}
                    control={<Radio />}
                    label={attendanceType.display_name}
                    disabled={attendanceType.display_name === employeeData?.attendance_type_display_name}
                  />
                ))}
              </RadioGroup>
              <CustomLabelError field={errors.attendanceId} />
            </FormControl>
          )}
        </Grid2>

        <Grid2 size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <CustomFormLabel sx={{ mt: 0 }}>Fecha de aplicación</CustomFormLabel>
            <CustomTextField
              type="date"
              name="applicationDate"
              value={formData.attendanceTypeForm.applicationDate}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
            <CustomLabelError field={errors.attendanceDate} />
          </FormControl>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default AttendanceTypeForm;
