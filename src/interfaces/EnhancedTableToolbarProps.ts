import type { FiltersConfig } from "./FiltersConfig";

export interface EnhancedTableToolbarProps {
  search?: string;
  setSearch?: (search: string) => void;
  handleSearch?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  filters?: FiltersConfig[];
  entity: string;
}
