import type { FiltersConfig } from "@/interfaces/FiltersConfig";
import { fetchSecretariasData } from "@/services/catalogs";

const defaultFiltersConfig: FiltersConfig[] = [
  {
    key: "active",
    label: "Estatus",
    type: "select",
    options: [
      { value: "true", label: "Activo" },
      { value: "false", label: "Inactivo" },
    ],
    gridSize: { xs: 12, sm: 4, lg: 2 },
  },
];

const generateYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear; i <= currentYear + 5; i++) {
    years.push({ value: i.toString(), label: i.toString() });
  }
  return years;
};

const holidayFiltersConfig: FiltersConfig[] = [
  {
    key: "year",
    label: "Año",
    type: "select",
    options: generateYearOptions(),
    gridSize: { xs: 12, sm: 4, lg: 2 },
  },
  {
    key: "active",
    label: "Estatus",
    type: "select",
    options: [
      { value: "true", label: "Activo" },
      { value: "false", label: "Inactivo" },
    ],
    gridSize: { xs: 12, sm: 4, lg: 2 },
  },
];

const direccionFiltersConfig: FiltersConfig[] = [
  {
    key: "secretaria_id",
    label: "Secretaria",
    type: "select",
    fetchOptions: fetchSecretariasData,
    gridSize: { xs: 12, sm: 4, lg: 2 },
  },
  {
    key: "active",
    label: "Estatus",
    type: "select",
    options: [
      { value: "true", label: "Activo" },
      { value: "false", label: "Inactivo" },
    ],
    gridSize: { xs: 12, sm: 4, lg: 2 },
  },
];

const filtersConfigs: Record<string, FiltersConfig[]> = {
  holiday: holidayFiltersConfig,
  direccion: direccionFiltersConfig,
};

export const getTableFiltersConfig = (catalogName: string): (() => FiltersConfig[]) => {
  return () => filtersConfigs[catalogName] || defaultFiltersConfig;
};
