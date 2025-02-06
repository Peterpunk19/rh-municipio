export type FilterType = "text" | "select" | "date" | "autocomplete";

export interface FiltersConfig {
  key: string;
  label: string;
  type: FilterType;
  options?: Array<{ value: any; label: string }>;
  defaultValue?: any;
  onChange?: (value: any) => void;
}
