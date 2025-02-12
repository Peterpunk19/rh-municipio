"use client";

import React from "react";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import { Box, Grid2 as Grid } from "@mui/material";
import { useDispatch } from "react-redux";
import { useSelector } from "@/store/hooks";
import { updateValues, updateErrors, updateCatalogs } from "@/store/employees/EmployeeSlice";
import { IFieldConfig, stepFormFields } from "./formConfig";
import { useRenderInputFields } from "@/components/customHooks/useRenderInputFields";
import CustomLabelError from "@/components/theme-elements/CustomLabelError";
import { fetchMunicipalitiesData } from "@/services/catalogs";

export const FormAddressData = () => {
  const dispatch = useDispatch();
  const formValues = useSelector((state: any) => state.employeesReducer.values);
  const errors = useSelector((state: any) => state.employeesReducer.errors);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    dispatch(updateValues({ [name as string]: value }));
    dispatch(updateErrors({ [name as string]: "" }));

    if (name === "stateId") {
      const municipalities = await fetchMunicipalitiesData(value as string);
      dispatch(updateCatalogs({ municipalities: municipalities }));
    }
  };

  const { renderField } = useRenderInputFields(formValues, handleChange);

  return (
    <Box>
      <Grid container spacing={3}>
        {stepFormFields.addressConfig.map((field: IFieldConfig) => {
          return (
            <Grid key={field.id} size={field.gridSize}>
              <CustomFormLabel htmlFor={field.id}>{field.label}</CustomFormLabel>
              {renderField(field)}
              <CustomLabelError field={errors[field.name]} />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
