import type { FiltersConfig } from "@/interfaces/FiltersConfig";
import { fetchSecretariasData, fetchDireccionesData, fetchCatalogData } from "@/services/catalogs";

export const tableFiltersConfig = (): FiltersConfig[] => [
  {
    key: "incident_id",
    label: "Tipo de Incidencia",
    type: "select",
    fetchOptions: () => fetchCatalogData("incidents"),
    gridSize: { xs: 12, sm: 4, lg: 3 },
  },
  {
    key: "secretaria",
    label: "Organismo Público",
    type: "select",
    fetchOptions: fetchSecretariasData,
    gridSize: { xs: 12, sm: 4, lg: 3 },
  },
  {
    key: "direccion",
    label: "Organismo administrativo",
    type: "select",
    fetchOptions: (secretaria) => fetchDireccionesData(secretaria),
    dependsOn: "secretaria",
    gridSize: { xs: 12, sm: 4, lg: 3 },
  },
  {
    key: "created_at",
    label: "Fecha de creación",
    type: "date",
    gridSize: { xs: 12, sm: 4, lg: 3 },
  },
];
