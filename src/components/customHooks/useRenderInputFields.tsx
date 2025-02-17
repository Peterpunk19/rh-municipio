import React from "react";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import { formatToNumbersOnly, formatToUpperAlphaNum } from "@/common/utils";
import CustomSelectField from "@/components/customFields/CustomSelectField";
import CustomSelectCategoryField from "@/components/customFields/CustomSelectCategoryField";
import type { IFieldConfig } from "@/app/(protected)/admin/employees/create/form-employees/steps/formConfig";

export const useRenderInputFields = (formData: any, handleChange: (e: any) => void) => {
  const renderField = (field: IFieldConfig) => {
    switch (field.type) {
      case "text":
        return (
          <>
            <CustomTextField
              id={field.id}
              name={field.name}
              type={field.type}
              value={formData[field.name] || ""}
              onChange={(e: any) => {
                if (field.format === "upperAlphaNum") {
                  handleChange(formatToUpperAlphaNum(e));
                } else if (field.format === "numbersOnly") {
                  handleChange(formatToNumbersOnly(e));
                } else {
                  handleChange(e);
                }
              }}
              inputProps={field.inputProps || { maxLength: 255, autoComplete: "off" }}
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
        return <CustomSelectField field={field} handleChange={handleChange} />;
      case "selectCategory":
        return <CustomSelectCategoryField field={field} handleChange={handleChange} />;
      default:
        return null;
    }
  };

  return { renderField };
};
