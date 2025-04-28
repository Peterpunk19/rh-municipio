import type { FiltersConfig } from "@/interfaces/FiltersConfig";
import { fetchCatalogData } from "@/services/catalogs";

export const tableFiltersConfig = (): FiltersConfig[] => [
  {
    key: "request_id",
    label: "Tipo de Solicitud",
    type: "select",
    fetchOptions: () => fetchCatalogData("requests"),
    gridSize: { xs: 12, sm: 4, lg: 3 },
  },
  {
    key: "request_date",
    label: "Fecha de Solicitud",
    type: "date",
    gridSize: { xs: 12, sm: 4, lg: 3 },
  },
];
