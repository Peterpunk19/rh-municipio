"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, FormControl, FormControlLabel, Grid2, MenuItem, Radio, RadioGroup, Typography } from "@mui/material";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomSelect from "@/app/components/forms/theme-elements/CustomSelect";
import CustomLabelError from "@/components/theme-elements/CustomLabelError";
import { updateFormData } from "@/store/employees-requests/CreateEmployeeRequest";
import type { RootState } from "@/store/store";
import { useFetchOptions } from "@/components/customHooks/useFetchOptions";
import { fetchCatalogData, fetchDireccionesData } from "@/services/catalogs";
import { ICatalog } from "@/utils/types";

const AdscriptionForm = () => {
  const dispatch = useDispatch();
  const { formData, errors, employeeData } = useSelector((state: RootState) => state.createEmployeeRequest);
  const [direcciones, setDirecciones] = useState<ICatalog[]>([]);

  const fetchDataAttendance = React.useCallback(() => fetchCatalogData("attendance"), []);
  const fetchDataSecretarias = React.useCallback(() => fetchCatalogData("secretarias"), []);
  const fetchDataLocations = React.useCallback(() => fetchCatalogData("location"), []);

  const { options: attendanceTypes, isLoading, error } = useFetchOptions(fetchDataAttendance);

  const {
    options: secretarias,
    isLoading: isLoadingSecretaria,
    error: errorSecretaria,
  } = useFetchOptions(fetchDataSecretarias);

  const {
    options: locations,
    isLoading: isLoadingLocations,
    error: errorLocations,
  } = useFetchOptions(fetchDataLocations);

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    console.log("handleChange", name, value);
    dispatch(updateFormData({ field: `adscriptionForm.${name}`, value }));
  };

  const fetchDirecciones = async (secretariaId: string) => {
    const response = await fetchDireccionesData(secretariaId);
    if (response.success && Array.isArray(response.responseObject)) {
      setDirecciones(response.responseObject);
    }
  };

  const handleChangeSecretaria = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    await fetchDirecciones(value);

    handleChange(event);
  };

  return (
    <Box>
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <CustomFormLabel sx={{ m: 0, p: 0 }}>Organismo Público</CustomFormLabel>
            <CustomSelect
              id={"secretariaId"}
              name={"secretariaId"}
              fullWidth
              value={formData.adscriptionForm.secretariaId || "0"}
              onChange={handleChangeSecretaria}
            >
              <MenuItem key="defaultSecretaria" value="0">
                Seleccione una opción
              </MenuItem>
              {isLoadingSecretaria ? (
                <MenuItem disabled>Cargando...</MenuItem>
              ) : errorSecretaria ? (
                <MenuItem disabled>Error al cargar</MenuItem>
              ) : (
                secretarias?.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.display_name}
                  </MenuItem>
                ))
              )}
            </CustomSelect>
            <CustomLabelError field={errors.secretariaId} />
          </FormControl>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <CustomFormLabel sx={{ m: 0, p: 0 }}>Organismo Administrativo</CustomFormLabel>
            <CustomSelect
              id="direccionId"
              name="direccionId"
              fullWidth
              value={formData.adscriptionForm.direccionId || "0"}
              onChange={handleChange}
            >
              <MenuItem key="defaultDireccion" value="0">
                Seleccione una opción
              </MenuItem>
              {direcciones &&
                direcciones.map((option) => (
                  <MenuItem
                    key={option.id}
                    value={option.id}
                    disabled={employeeData?.direccion_display_name === option.display_name}
                  >
                    {option.display_name}
                  </MenuItem>
                ))}
            </CustomSelect>
            <CustomLabelError field={errors.direccionId} />
          </FormControl>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 4 }} sx={{ mt: 0, pt: 0 }}>
          <FormControl fullWidth sx={{ mt: 0, pt: 0 }}>
            <CustomFormLabel sx={{ m: 0, p: 0 }}>Seleccione la nueva ubicación</CustomFormLabel>
            <CustomSelect
              fullWidth
              name="locationId"
              value={formData.adscriptionForm.locationId || "0"}
              onChange={handleChange}
              disabled={isLoading || error}
            >
              <MenuItem key="default" value={0}>
                Selecciona una opción
              </MenuItem>
              {isLoadingLocations ? (
                <MenuItem disabled>Cargando...</MenuItem>
              ) : errorLocations ? (
                <MenuItem disabled>Error al cargar</MenuItem>
              ) : (
                locations?.map((location) => {
                  const isSameLocation = location.display_name === employeeData?.location_display_name;

                  return (
                    <MenuItem
                      key={location.id}
                      value={location.id}
                      sx={{
                        backgroundColor: isSameLocation ? "primary.light" : "inherit",
                      }}
                    >
                      {location.display_name}
                    </MenuItem>
                  );
                })
              )}
            </CustomSelect>
            <CustomLabelError field={errors.locationId} />
          </FormControl>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 12 }}>
          <CustomFormLabel sx={{ m: 0, p: 0 }}> Registro de Asistencia</CustomFormLabel>

          {!isLoading && error ? (
            <Typography variant="body1" gutterBottom>
              Error al cargar los tipos de checado
            </Typography>
          ) : (
            <FormControl component="fieldset">
              <RadioGroup
                row
                name="attendanceType"
                value={formData.adscriptionForm.attendanceType}
                onChange={handleChange}
              >
                {attendanceTypes.map((attendanceType) => (
                  <FormControlLabel
                    key={`attendance-${attendanceType.id}`}
                    value={attendanceType.id}
                    control={<Radio />}
                    label={attendanceType.display_name}
                  />
                ))}
              </RadioGroup>
              <CustomLabelError field={errors.attendanceId} />
            </FormControl>
          )}
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default AdscriptionForm;
