export interface CustomFieldProps {
  field: any;
  handleChange: (e: any) => void;
}

export interface CustomAutocompleteProps {
  field: any;
  handleChange: (e: any, newValue: string | null) => void;
}
