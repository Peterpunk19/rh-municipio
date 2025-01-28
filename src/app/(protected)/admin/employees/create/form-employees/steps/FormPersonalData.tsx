'use client'

import React from "react";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import { Box, Grid2 as Grid } from "@mui/material";
import {fetchGenderData} from "@/services/catalogs";
import { useDispatch } from "react-redux";
import { useSelector } from "@/store/hooks";
import { updateValues, updateErrors } from "@/store/apps/employees/EmployeeSlice";
import { stepFormFields } from "./formConfig";
import {useFetchOptions} from "@/components/customHooks/useFetchOptions";
import {useRenderInputFields} from "@/components/customHooks/useRenderInputFields";
import CustomLabelError from "@/components/theme-elements/CustomLabelError";

export const FormPersonalData = () => {
  const dispatch = useDispatch();
  const formValues = useSelector((state: any) => state.employeesReducer.values);
  const errors = useSelector((state: any) => state.employeesReducer.errors);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    dispatch(updateValues({ [name as string]: value }));
    dispatch(updateErrors({ [name as string]: '' }));
  };

  const { options: gender, isLoading, error } = useFetchOptions(fetchGenderData);
  const { renderField } = useRenderInputFields(formValues, handleChange);

  return (
    <Box>
      <Grid container spacing={3}>
        {stepFormFields.personalDataConfig.map((field) => (
          <Grid key={field.id} size={field.gridSize}>
            <CustomFormLabel htmlFor={field.id}>{field.label}</CustomFormLabel>
            {renderField(field, gender, isLoading, error, errors[field.name])}
            <CustomLabelError field={errors[field.name]} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};