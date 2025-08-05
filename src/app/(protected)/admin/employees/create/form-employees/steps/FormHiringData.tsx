"use client";

import React, { useEffect } from "react";
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
import { fetchCategoryData, fetchEmployeeTypesData, fetchSalaryData } from "@/services/catalogs";
import { logger } from "@/lib/logger";

export const FormHiringData = () => {
  const dispatch = useDispatch();
  const formValues = useSelector((state: any) => state.employeesReducer.values);
  const catalogsValues = useSelector((state: any) => state.employeesReducer.catalogs);
  const errors = useSelector((state: any) => state.employeesReducer.errors);
  const helperText = useSelector((state: any) => state.employeesReducer.helperText);
  const employeeTypeName = formValues.employeeTypeName;

  const loadCatalogs = async () => {
    try {
      const [employeeTypesResponse, categoriesResponse] = await Promise.all([
        fetchEmployeeTypesData(),
        fetchCategoryData(),
      ]);

      const catalogsUpdate: { employeeTypes?: any; categories?: any } = {};
      const errorsUpdate: { employeeTypeName?: string; categoryId?: string } = {};

      if (employeeTypesResponse?.success && employeeTypesResponse?.responseObject) {
        catalogsUpdate.employeeTypes = employeeTypesResponse;
      } else {
        errorsUpdate.employeeTypeName = "No se pudieron cargar los tipos de empleados.";
      }

      if (categoriesResponse?.success && categoriesResponse?.responseObject) {
        catalogsUpdate.categories = categoriesResponse;
      } else {
        errorsUpdate.categoryId = "No se pudieron cargar las categorías.";
      }

      if (Object.keys(catalogsUpdate).length > 0) {
        dispatch(updateCatalogs(catalogsUpdate));
      }
      if (Object.keys(errorsUpdate).length > 0) {
        dispatch(updateErrors(errorsUpdate));
      }
    } catch (error: any) {
      logger.error({ error: error.message, stack: error.stack });
      dispatch(
        updateErrors({
          employeeTypeName: "Error inesperado al cargar catálogos.",
          categoryId: "Error inesperado al cargar catálogos.",
        }),
      );
    }
  };

  useEffect(() => {
    loadCatalogs();
  }, [dispatch]);

  const modifiedHiringConfig = stepFormFields.hiringConfig.map((field) => {
    if (field.name === "tradeUnionId") {
      return { ...field, display: employeeTypeName === "base_sindicalizado" };
    }
    return field;
  });

  const fieldsToRender = modifiedHiringConfig.filter((field) => field.display !== false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;

    dispatch(updateValues({ [name as string]: value }));
    dispatch(updateErrors({ [name as string]: "" }));

    let newValues = { ...formValues };
    if (name) {
      newValues[name as string] = value;
    }

    if (
      (name === "categoryId" || name === "employeeTypeName") &&
      Number(newValues.categoryId) &&
      newValues.employeeTypeName &&
      newValues.employeeTypeName != "0"
    ) {
      await calculateSalary(newValues.categoryId, newValues.employeeTypeName);
    } else if (name === "categoryId" || name === "employeeTypeName") {
      dispatch(updateHelperText({ categoryId: "Salario: $0.00" }));
    }

    if (name === "secretariaId") {
      const municipalities = await fetchDireccionesData(value as string);
      dispatch(updateCatalogs({ direcciones: municipalities }));

      if (Number(newValues.categoryId) && newValues.employeeTypeName && newValues.employeeTypeName !== "0") {
        await calculateSalary(newValues.categoryId, newValues.employeeTypeName);
      }
    }
  };

  const calculateSalary = async (categoryId: string, employeeTypeName: string) => {
    const employeeTypes = catalogsValues.employeeTypes?.responseObject || [];
    const employeeType = employeeTypes.find((type: any) => type.name === employeeTypeName);
    if (employeeType) {
      const response = await fetchSalaryData(Number(categoryId), employeeType.id);
      if (response?.success && response?.responseObject) {
        const formattedAmount = currencyFormatter.format(response.responseObject.salary);
        dispatch(updateHelperText({ categoryId: `Salario: ${formattedAmount}` }));
      } else {
        dispatch(
          updateHelperText({
            categoryId: "Salario: $0.00",
          }),
        );
      }
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
