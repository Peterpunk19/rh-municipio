"use client";

import React, { useCallback } from "react";
import MenuItem from "@mui/material/MenuItem";
import CustomSelect from "@/app/components/forms/theme-elements/CustomSelect";
import { useSelector } from "@/store/hooks";
import { useFetchOptions } from "@/components/customHooks/useFetchOptions";
import { fetchCatalogData } from "@/services/catalogs";
import { CustomFieldProps } from "@/components/customFields/type";
import { updateCatalogs } from "@/store/employees/EmployeeSlice";
import { useDispatch } from "react-redux";

const CustomSelectCategoryField: React.FC<CustomFieldProps> = ({ field, handleChange }) => {
  const dispatch = useDispatch();
  const formValues = useSelector((state: any) => state.employeesReducer.values);
  const catalogsValues = useSelector((state: any) => state.employeesReducer.catalogs);

  const fetchData = useCallback(async () => {
    const data = await fetchCatalogData(field.catalog);
    if (data && field.name === "categoryId") {
      dispatch(updateCatalogs({ categories: data.responseObject }));
    }

    return data;
  }, [field.catalog, field.name, catalogsValues.municipalities, catalogsValues.direcciones]);
  const { options: data, isLoading, error } = useFetchOptions(fetchData);

  const selectedValue =
    isLoading || error || !data.some((option) => option.id == formValues[field.name]) ? "0" : formValues[field.name];

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
          <MenuItem key={option.id} value={option.id} data-salary={option.salary}>
            {option.display_name}
          </MenuItem>
        ))
      )}
    </CustomSelect>
  );
};
export default CustomSelectCategoryField;
