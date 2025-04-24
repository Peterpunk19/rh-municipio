import type { FiltersConfig } from "@/interfaces/FiltersConfig";
import {
  fetchSecretariasData,
  fetchDireccionesData,
  fetchAttendanceData,
  fetchLocationsData,
} from "@/services/catalogs";

export const tableFiltersConfig = (): FiltersConfig[] => [
  {
    key: "checkIn",
    label: "Fecha de entrada",
    type: "date",
    gridSize: { xs: 12, sm: 6, lg: 4 },
  },
  {
    key: "checkOut",
    label: "Fecha de salida",
    type: "date",
    gridSize: { xs: 12, sm: 6, lg: 4 },
  },
  {
    key: "typeAttendance",
    label: "Asistencia",
    type: "select",
    fetchOptions: fetchAttendanceData,
    gridSize: { xs: 12, sm: 6, lg: 4 },
  },
  {
    key: "location",
    label: "Ubicación",
    type: "select",
    fetchOptions: fetchLocationsData,
    gridSize: { xs: 12, sm: 6, lg: 4 },
  },
  {
    key: "organismPublic",
    label: "Organismo Público",
    type: "select",
    fetchOptions: fetchSecretariasData,
    gridSize: { xs: 12, sm: 6, lg: 4 },
  },
  {
    key: "organismAdministrative",
    label: "Organismo administrativo",
    type: "select",
    fetchOptions: (organismPublic) => fetchDireccionesData(organismPublic),
    dependsOn: "organismPublic",
    gridSize: { xs: 12, sm: 6, lg: 4 },
  },
];
