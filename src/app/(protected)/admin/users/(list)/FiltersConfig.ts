import type { FiltersConfig } from "@/interfaces/FiltersConfig";
import { fetchRolesData } from "@/services/catalogs";

export const getFiltersConfig = (): FiltersConfig[] => [
  {
    key: "active",
    label: "Estatus",
    type: "select",
    options: [
      { value: "true", label: "Activo" },
      { value: "false", label: "Inactivo" },
    ],
    gridSize: { xs: 12, sm: 4, lg: 4 },
  },
  {
    key: "role_id",
    label: "Rol",
    type: "select",
    fetchOptions: fetchRolesData,
    gridSize: { xs: 12, sm: 4, lg: 4 },
  },
];
