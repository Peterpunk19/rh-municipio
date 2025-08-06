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
    key: "employeeTypeId",
    label: "Tipo de empleado",
    type: "select",
    fetchOptions: () => fetchCatalogData("employee-type"),
    gridSize: { xs: 12, sm: 4, lg: 3 },
  },
];
