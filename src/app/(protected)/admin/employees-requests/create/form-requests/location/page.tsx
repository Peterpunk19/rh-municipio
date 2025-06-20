"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, FormControl, Grid2, MenuItem, Typography } from "@mui/material";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomSelect from "@/app/components/forms/theme-elements/CustomSelect";
import CustomLabelError from "@/components/theme-elements/CustomLabelError";
import { updateFormData } from "@/store/employees-requests/CreateEmployeeRequest";
import type { RootState } from "@/store/store";
import { useFetchOptions } from "@/components/customHooks/useFetchOptions";
import { fetchCatalogData } from "@/services/catalogs";
import DateRangePicker from "@/components/customFields/DateRangePicker";

const LocationForm = () => {
  const dispatch = useDispatch();
  const { formData, errors, employeeData } = useSelector((state: RootState) => state.createEmployeeRequest);

  const catalogName = "location";
  const fetchData = React.useCallback(() => fetchCatalogData(catalogName), []);
  const { options: locations, isLoading, error } = useFetchOptions(fetchData);

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    dispatch(updateFormData({ field: `locationForm.${name}`, value }));
  };

  const handleDateChange = (field: string, value: string) => {
    dispatch(updateFormData({ field: `locationForm.${field}`, value }));
  };

  return (
    <Box>
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, md: 4 }} sx={{ mt: 0, pt: 0 }}>
          <FormControl fullWidth sx={{ mt: 0, pt: 0 }}>
            <CustomFormLabel sx={{ m: 0, p: 0 }}>Seleccione la nueva ubicación</CustomFormLabel>
            <CustomSelect
              fullWidth
              name="newLocationId"
              value={formData.locationForm.newLocationId}
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
                  <MenuItem
                    key={location.id}
                    value={location.id}
                    disabled={location.display_name === employeeData?.location_display_name}
                  >
                    {location.display_name}
                  </MenuItem>
                ))
              )}
            </CustomSelect>
            <CustomLabelError field={errors.locationId} />
          </FormControl>
        </Grid2>

        <Grid2 size={{ xs: 12 }}>
          <DateRangePicker
            startDate={formData.locationForm.startDate}
            endDate={formData.locationForm.endDate}
            onStartDateChange={(date) => handleDateChange("startDate", date)}
            onEndDateChange={(date) => handleDateChange("endDate", date)}
            startDateError={errors.startDate}
            endDateError={errors.endDate}
          />
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default LocationForm;
