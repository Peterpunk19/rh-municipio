'use client'

import React, {useState} from "react";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import { Box, Grid2 as Grid } from "@mui/material";
import {
  fetchSecretariasData,
  fetchCategoryData,
  fetchDireccionesData,
  fetchEmployeeTypesData,
} from "@/services/catalogs";
import { useDispatch } from "react-redux";
import { useSelector } from "@/store/hooks";
import {updateValues, updateErrors} from "@/store/employees/EmployeeSlice";
import { useFetchOptions } from "@/components/customHooks/useFetchOptions";
import {useRenderInputFields } from "@/components/customHooks/useRenderInputFields";
import CustomLabelError from "@/components/theme-elements/CustomLabelError";
import { stepFormFields, IFieldConfig} from "@/app/(protected)/admin/employees/create/form-employees/steps/formConfig";
import CircularProgress from "@mui/material/CircularProgress";

export const FormHiringData = () => {
  const dispatch = useDispatch();
  const formValues = useSelector((state: any) => state.employeesReducer.values);
  const errors = useSelector((state: any) => state.employeesReducer.errors);
  const [selectedSecretaria, setSelectedSecretaria] = useState<number | null>(formValues.secretariaId);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    dispatch(updateValues({ [name as string]: value }));
    dispatch(updateErrors({ [name as string]: '' }));

    if (name === "secretariaId") {
      setSelectedSecretaria(value ? Number(value) : null);
      dispatch(updateValues({ direccionId: '0' }));
    }

    if (name === "direccionId") {
      dispatch(updateValues({ direccionId: '0' }));
    }

  };

  const { renderField } = useRenderInputFields(formValues, handleChange);

  const { options: categoryOptions, isLoading: categoryLoading, error: categoryError } = useFetchOptions(fetchCategoryData);
  const { options: employeeTypeOptions, isLoading: employeeTypeLoading, error: employeeTypeError } = useFetchOptions(fetchEmployeeTypesData);
  const { options: secretariaOptions, isLoading: secretariaLoading, error: secretariaError } = useFetchOptions(fetchSecretariasData);
  const { options: direccionOptions, isLoading: direccionLoading, error: direccionError } = useFetchOptions(fetchDireccionesData, selectedSecretaria);

  return (
    <Box>
      <Grid container spacing={3}>
        {stepFormFields.hiringConfig.map((field: IFieldConfig) => {
          let selectOptions: any[] | undefined = [];
          let isLoading = false;
          let errorMessage = '';

          switch (field.name) {
            case "categoryId":
              selectOptions = categoryOptions;
              isLoading = categoryLoading;
              errorMessage = categoryError ?? '';
              break;
            case "employeeTypeId":
              selectOptions = employeeTypeOptions;
              isLoading = employeeTypeLoading;
              errorMessage = employeeTypeError ?? '';
              break;
            case "secretariaId":
              selectOptions = secretariaOptions;
              isLoading = secretariaLoading;
              errorMessage = secretariaError ?? '';
              break;
            case "direccionId":
              selectOptions = direccionOptions;
              isLoading = direccionLoading;
              errorMessage = direccionError ?? '';
              break;
          }

          return (
          <Grid key={field.id} size={field.gridSize}>
            <CustomFormLabel htmlFor={field.id}>{field.label}</CustomFormLabel>
            {
              isLoading ? (
                <CircularProgress size={24} />
              ) : (
                renderField(field, selectOptions, isLoading, errorMessage, errors[field.name])
              )
            }
            <CustomLabelError field={errors[field.name]} />
          </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};