"use client";

import React, { useState } from "react";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import { Box, Grid2 as Grid } from "@mui/material";
import { fetchMunicipalitiesData, fetchStatesData } from "@/services/catalogs";
import { useDispatch } from "react-redux";
import { useSelector } from "@/store/hooks";
import { updateValues, updateErrors } from "@/store/employees/EmployeeSlice";
import { IFieldConfig, stepFormFields } from "./formConfig";
import { useFetchOptions } from "@/components/customHooks/useFetchOptions";
import { useRenderInputFields } from "@/components/customHooks/useRenderInputFields";
import CustomLabelError from "@/components/theme-elements/CustomLabelError";
import CircularProgress from "@mui/material/CircularProgress";

export const FormAddressData = () => {
  const dispatch = useDispatch();
  const formValues = useSelector((state: any) => state.employeesReducer.values);
  const errors = useSelector((state: any) => state.employeesReducer.errors);
  const [selectedState, setSelectedState] = useState<number | null>(formValues.stateId);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    dispatch(updateValues({ [name as string]: value }));
    dispatch(updateErrors({ [name as string]: "" }));

    if (name === "stateId") {
      setSelectedState(value ? Number(value) : null);
      dispatch(updateValues({ municipalityId: "0" }));
    }
  };

  const { renderField } = useRenderInputFields(formValues, handleChange);

  const { options: stateOptions, isLoading: stateLoading, error: stateError } = useFetchOptions(fetchStatesData);
  const {
    options: municipalityOptions,
    isLoading: municipalityLoading,
    error: municipalityError,
  } = useFetchOptions(fetchMunicipalitiesData, selectedState);

  return (
    <Box>
      <Grid container spacing={3}>
        {stepFormFields.addressConfig.map((field: IFieldConfig) => {
          let selectOptions: any[] | undefined = [];
          let isLoading = false;
          let errorMessage = "";

          switch (field.name) {
            case "stateId":
              selectOptions = stateOptions;
              isLoading = stateLoading;
              errorMessage = stateError ?? "";
              break;
            case "municipalityId":
              selectOptions = municipalityOptions;
              isLoading = municipalityLoading;
              errorMessage = municipalityError ?? "";
              break;
          }

          return (
            <Grid key={field.id} size={field.gridSize}>
              <CustomFormLabel htmlFor={field.id}>{field.label}</CustomFormLabel>
              {formValues.stateId !== "0" ? (
                municipalityOptions.length > 0 ? (
                  renderField(field, selectOptions, isLoading, errorMessage, errors[field.name])
                ) : (
                  <CircularProgress size={24} />
                )
              ) : (
                renderField(field, selectOptions, isLoading, errorMessage, errors[field.name])
              )}
              <CustomLabelError field={errors[field.name]} />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
