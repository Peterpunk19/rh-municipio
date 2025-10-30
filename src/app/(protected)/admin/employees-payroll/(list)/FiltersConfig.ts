import type { FiltersConfig } from "@/interfaces/FiltersConfig";
import {
  fetchSecretariasData,
  fetchDireccionesData,
  fetchAttendanceData,
  fetchLocationsData,
} from "@/services/catalogs";

export const tableFiltersConfig = (): FiltersConfig[] => [
  {
    key: "from",
    label: "De",
    type: "date",
    gridSize: { xs: 12, sm: 6, lg: 3 },
  },
  {
    key: "to",
    label: "A",
    type: "date",
    gridSize: { xs: 12, sm: 6, lg: 3 },
  },
  {
    key: "secretariaId",
    label: "Organismo Público",
    type: "select",
    fetchOptions: fetchSecretariasData,
    gridSize: { xs: 12, sm: 6, lg: 3 },
  },
  {
    key: "direccionId",
    label: "Organismo administrativo",
    type: "select",
    fetchOptions: (organismPublic) => fetchDireccionesData(organismPublic),
    dependsOn: "secretariaId",
    gridSize: { xs: 12, sm: 6, lg: 3 },
  },
];
