"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, FormControl, Grid2, MenuItem } from "@mui/material";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomSelect from "@/app/components/forms/theme-elements/CustomSelect";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
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

  const fetchDataSecretarias = React.useCallback(() => fetchCatalogData("secretarias"), []);

  const {
    options: secretarias,
    isLoading: isLoadingSecretaria,
    error: errorSecretaria,
  } = useFetchOptions(fetchDataSecretarias);

  const handleChange = (event: any) => {
    const { name, value } = event.target;
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
        <Grid2 size={{ xs: 12, md: 4 }}>
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

        <Grid2 size={{ xs: 12, md: 8 }}>
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
            <CustomFormLabel sx={{ m: 0, p: 0 }}>Oficio</CustomFormLabel>
            <CustomTextField
              type="text"
              name="oficio"
              value={formData.adscriptionForm.oficio || ""}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
            <CustomLabelError field={errors.oficio} />
          </FormControl>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 4 }} sx={{ mt: 0, pt: 0 }}>
          <FormControl fullWidth sx={{ mt: 0, pt: 0 }}>
            <CustomFormLabel sx={{ m: 0, p: 0 }}>Fecha de solicitud</CustomFormLabel>
            <CustomTextField
              type="date"
              name="requestDate"
              value={formData.adscriptionForm.requestDate}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
            <CustomLabelError field={errors.requestDate} />
          </FormControl>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 4 }} sx={{ mt: 0, pt: 0 }}>
          <FormControl fullWidth sx={{ mt: 0, pt: 0 }}>
            <CustomFormLabel sx={{ m: 0, p: 0 }}>Fecha de inicio</CustomFormLabel>
            <CustomTextField
              type="date"
              name="startDate"
              value={formData.adscriptionForm.startDate}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
            <CustomLabelError field={errors.startDate} />
          </FormControl>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default AdscriptionForm;
