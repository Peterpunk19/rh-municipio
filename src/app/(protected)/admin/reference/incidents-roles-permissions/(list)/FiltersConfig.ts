import type { FiltersConfig } from "@/interfaces/FiltersConfig";
import { fetchCatalogData } from "@/services/catalogs";

export const tableFiltersConfig = (): FiltersConfig[] => [
  {
    key: "incidentId",
    label: "Tipo de Incidencia",
    type: "select",
    fetchOptions: () => fetchCatalogData("incidents"),
    gridSize: { xs: 12, sm: 4, lg: 3 },
  },
  {
    key: "roleId",
    label: "Roles",
    type: "select",
    fetchOptions: () => fetchCatalogData("roles"),
    gridSize: { xs: 12, sm: 4, lg: 3 },
  },
];
