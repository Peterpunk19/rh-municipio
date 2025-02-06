import type { FiltersConfig } from "./FiltersConfig";

export interface EnhancedTableToolbarProps {
  numSelected: number;
  search?: string;
  handleSearch?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  filters?: FiltersConfig[];
}
