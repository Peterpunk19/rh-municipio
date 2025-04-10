"use client";

import React from "react";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import { Box, Grid2 as Grid } from "@mui/material";
import { fetchDireccionesData } from "@/services/catalogs";
import { useDispatch } from "react-redux";
import { useSelector } from "@/store/hooks";
import { updateValues, updateErrors, updateHelperText, updateCatalogs } from "@/store/employees/EmployeeSlice";
import { useRenderInputFields } from "@/components/customHooks/useRenderInputFields";
import CustomLabelError from "@/components/theme-elements/CustomLabelError";
import { stepFormFields, IFieldConfig } from "@/app/(protected)/admin/employees/create/form-employees/steps/formConfig";
import CustomHelperText from "@/components/theme-elements/CustomHelperText";
import { currencyFormatter } from "@/common/utils";

export const FormHiringData = () => {
  const dispatch = useDispatch();
  const formValues = useSelector((state: any) => state.employeesReducer.values);
  const catalogsValues = useSelector((state: any) => state.employeesReducer.catalogs);
  const errors = useSelector((state: any) => state.employeesReducer.errors);
  const helperText = useSelector((state: any) => state.employeesReducer.helperText);

  const employeeTypeName = formValues.employeeTypeName;

  const modifiedHiringConfig = stepFormFields.hiringConfig.map((field) => {
    if (field.name === "tradeUnionId") {
      return { ...field, display: employeeTypeName === "base_sindicalizado" };
    }
    return field;
  });

  const fieldsToRender = modifiedHiringConfig.filter((field) => field.display !== false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    console.log(name, value);

    dispatch(updateValues({ [name as string]: value }));
    dispatch(updateErrors({ [name as string]: "" }));

    if (name === "categoryId") {
      const selectedCategory = catalogsValues.categories.find((cat: any) => cat.id === value);
      const valueHelperText =
        selectedCategory !== undefined ? `Salario: ${currencyFormatter.format(selectedCategory.salary)}` : "";
      dispatch(updateHelperText({ categoryId: valueHelperText }));
    }

    if (name === "secretariaId") {
      const municipalities = await fetchDireccionesData(value as string);
      dispatch(updateCatalogs({ direcciones: municipalities }));
    }
  };

  const { renderField } = useRenderInputFields(formValues, handleChange);

  return (
    <Box>
      <Grid container spacing={3}>
        {fieldsToRender.map((field: IFieldConfig) => {
          return (
            <Grid key={field.id} size={field.gridSize}>
              <CustomFormLabel htmlFor={field.id}>{field.label}</CustomFormLabel>
              {renderField(field)}
              <CustomHelperText field={helperText[field.name]} />
              <CustomLabelError field={errors[field.name]} />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
