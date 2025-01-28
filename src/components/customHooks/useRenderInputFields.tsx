import React from "react";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomSelect from "@/app/components/forms/theme-elements/CustomSelect";
import MenuItem from "@mui/material/MenuItem";

export const useRenderInputFields = (formData: any, handleChange: (e: any) => void) => {
  const formatToUpperAlphaNum = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.toUpperCase().replace(/[^a-zA-Z0-9 ]/g, '').slice(0, 18);
    return e;
  };

  const renderField = (field: any, options: any[] = [], isLoading?: boolean, error?: string | null, errorField?: string | null) => {
    switch (field.type) {
      case "text":
        return (
          <>
            <CustomTextField
              id={field.id}
              name={field.name}
              type={field.type}
              value={formData[field.name] || ""}
              error={errorField}
              onChange={(e: any) => {
                if (field.format === "upperAlphaNum") {
                  handleChange(formatToUpperAlphaNum(e));
                } else {
                  handleChange(e);
                }
              }}
              variant="outlined"
              fullWidth
            />
          </>
        );
      case "date":
        return (
          <CustomTextField
            id={field.id}
            name={field.name}
            type="date"
            value={formData[field.name] || ""}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />
        );
      case "select":
        return (
          <CustomSelect id={field.id} name={field.name} fullWidth value={formData[field.name] || "0"} onChange={handleChange}>
            <MenuItem key="default" value="0">Seleccione uno</MenuItem>
            {isLoading ? <MenuItem disabled>Loading...</MenuItem> : error ? <MenuItem disabled>{error}</MenuItem> : options.map((option) => (
              <MenuItem key={option.id} value={option.id}>{option.display_name}</MenuItem>
            ))}
          </CustomSelect>
        );
      default:
        return null;
    }
  };

  return { renderField };
};
