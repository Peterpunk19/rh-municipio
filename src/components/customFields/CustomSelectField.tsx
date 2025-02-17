"use client";

import React, { useCallback } from "react";
import MenuItem from "@mui/material/MenuItem";
import CustomSelect from "@/app/components/forms/theme-elements/CustomSelect";
import { useSelector } from "@/store/hooks";
import { useFetchOptions } from "@/components/customHooks/useFetchOptions";
import { fetchCatalogData } from "@/services/catalogs";
import { CustomFieldProps } from "@/components/customFields/type";

const CustomSelectField: React.FC<CustomFieldProps> = ({ field, handleChange }) => {
  const formValues = useSelector((state: any) => state.employeesReducer.values);
  const catalogsValues = useSelector((state: any) => state.employeesReducer.catalogs);

  const fetchData = useCallback(() => {
    if (field.name === "municipalityId" && formValues.stateId !== "0" && catalogsValues.municipalities) {
      return Promise.resolve(catalogsValues.municipalities);
    }

    if (field.name === "direccionId" && catalogsValues.direcciones) {
      return Promise.resolve(catalogsValues.direcciones);
    }

    return fetchCatalogData(field.catalog);
  }, [field.catalog, field.name, catalogsValues.municipalities, catalogsValues.direcciones]);

  const { options: data, isLoading, error } = useFetchOptions(fetchData);

  const selectedValue =
    field.keyValue == "name"
      ? isLoading || error || !data.some((option) => option.name == formValues[field.name])
        ? "0"
        : formValues[field.name]
      : isLoading || error || !data.some((option) => option.id == formValues[field.name])
        ? "0"
        : formValues[field.name];

  return (
    <CustomSelect id={field.id} name={field.name} fullWidth value={selectedValue} onChange={handleChange}>
      <MenuItem key="default" value="0">
        {field.placeholder ?? "Seleccione una opción"}
      </MenuItem>
      {isLoading ? (
        <MenuItem disabled>Loading...</MenuItem>
      ) : error ? (
        <MenuItem disabled>{error}</MenuItem>
      ) : (
        data.map((option) => (
          <MenuItem key={option.id} value={field.keyValue == "name" ? option.name : option.id}>
            {option.display_name}
          </MenuItem>
        ))
      )}
    </CustomSelect>
  );
};
export default CustomSelectField;
