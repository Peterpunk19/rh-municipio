import type { IResponseObject } from "../utils/types/index";
export type FilterType = "text" | "select" | "date" | "autocomplete" | "date-range";

export interface FiltersConfig {
  key: string;
  label: string;
  type: FilterType;
  options?: Array<{ value: string; label: string }>;
  fetchOptions?: (params?: any) => Promise<IResponseObject | null>;
  dependsOn?: string;
  startKey?: string;
  endKey?: string;
  defaultValue?: any;
  loading?: boolean;
  error?: Error | null;
  onChange?: (value: any) => void;
}
