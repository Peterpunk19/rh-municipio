import type { FiltersConfig } from "@/interfaces/FiltersConfig";
import {
  fetchEmployeeTypesData,
  fetchEmployeeStatusData,
  fetchGenderData,
  fetchCategoryData,
  fetchLocationsData,
  fetchSecretariasData,
  fetchDireccionesData,
  fetchAttendanceData,
} from "@/services/catalogs";

export const tableFiltersConfig = (): FiltersConfig[] => [
  {
    key: "employee_type",
    label: "Tipo de empleado",
    type: "select",
    fetchOptions: fetchEmployeeTypesData,
    gridSize: { xs: 12, sm: 4, lg: 4 },
  },
  {
    key: "employee_status",
    label: "Estatus",
    type: "select",
    fetchOptions: fetchEmployeeStatusData,
    gridSize: { xs: 12, sm: 4, lg: 2 },
  },
  {
    key: "gender",
    label: "Género",
    type: "select",
    fetchOptions: fetchGenderData,
    gridSize: { xs: 12, sm: 4, lg: 2 },
  },
  {
    key: "category",
    label: "Categoría",
    type: "select",
    fetchOptions: fetchCategoryData,
    gridSize: { xs: 12, sm: 4, lg: 4 },
  },
  {
    key: "location",
    label: "Ubicación",
    type: "select",
    fetchOptions: fetchLocationsData,
    gridSize: { xs: 12, sm: 4, lg: 3 },
  },
  {
    key: "attendance",
    label: "Tipo de checado",
    type: "select",
    fetchOptions: fetchAttendanceData,
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
    key: "start_job_date",
    label: "Rango de contratación",
    type: "date-range",
    gridSize: { xs: 12, sm: 4, lg: 4 },
  },
  {
    key: "end_job_date",
    label: "Rango de terminación",
    type: "date-range",
    gridSize: { xs: 12, sm: 4, lg: 4 },
  },
];
