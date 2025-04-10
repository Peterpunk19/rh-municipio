"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, FormControl, Grid2, MenuItem } from "@mui/material";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomSelect from "@/app/components/forms/theme-elements/CustomSelect";
import CustomLabelError from "@/components/theme-elements/CustomLabelError";
import { updateFormData } from "@/store/employees-requests/CreateEmployeeRequest";
import type { RootState } from "@/store/store";
import { useFetchOptions } from "@/components/customHooks/useFetchOptions";
import { fetchCatalogData } from "@/services/catalogs";

const FingerprintForm = () => {
  const dispatch = useDispatch();
  const { formData, errors } = useSelector((state: RootState) => state.createEmployeeRequest);

  const catalogName = "location";
  const fetchData = React.useCallback(() => fetchCatalogData(catalogName), []);
  const { options: locations, isLoading, error } = useFetchOptions(fetchData);

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    dispatch(updateFormData({ field: `fingerprintForm.${name}`, value }));
  };

  return (
    <Box>
      <Grid2 container spacing={2} sx={{ mb: 2 }}>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <CustomFormLabel sx={{ mt: 0 }}>Ubicación</CustomFormLabel>
            <CustomSelect
              fullWidth
              name="locationId"
              value={formData.fingerprintForm.locationId}
              onChange={handleChange}
              disabled={isLoading || error}
            >
              <MenuItem key="default" value={0}>
                Selecciona la ubicación
              </MenuItem>
              {isLoading ? (
                <MenuItem disabled>Cargando...</MenuItem>
              ) : error ? (
                <MenuItem disabled>Error al cargar</MenuItem>
              ) : (
                locations?.map((location) => (
                  <MenuItem key={location.id} value={location.id}>
                    {location.display_name}
                  </MenuItem>
                ))
              )}
            </CustomSelect>
            <CustomLabelError field={errors.locationId} />
          </FormControl>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <CustomFormLabel sx={{ mt: 0 }}>Fecha de registro de huella</CustomFormLabel>
            <CustomTextField
              type="date"
              name="requestDate"
              value={formData.fingerprintForm.requestDate}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
            <CustomLabelError field={errors.requestDate} />
          </FormControl>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default FingerprintForm;
