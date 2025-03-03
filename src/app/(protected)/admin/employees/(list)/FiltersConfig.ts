import type { FiltersConfig } from "@/interfaces/FiltersConfig";
import {
  fetchEmployeeTypesData,
  fetchEmployeeStatusData,
  fetchGenderData,
  fetchCategoryData,
  fetchLocationsData,
  fetchSecretariasData,
  fetchDireccionesData,
} from "@/services/catalogs";

export const tableFiltersConfig = (): FiltersConfig[] => [
  {
    key: "employee_type",
    label: "Tipo de empleado",
    type: "select",
    fetchOptions: fetchEmployeeTypesData,
  },
  {
    key: "employee_status",
    label: "Estatus",
    type: "select",
    fetchOptions: fetchEmployeeStatusData,
  },
  {
    key: "gender",
    label: "Género",
    type: "select",
    fetchOptions: fetchGenderData,
  },
  {
    key: "category",
    label: "Categoría",
    type: "select",
    fetchOptions: fetchCategoryData,
  },
  {
    key: "location",
    label: "Ubicación",
    type: "select",
    fetchOptions: fetchLocationsData,
  },
  {
    key: "secretaria",
    label: "Organismo Público",
    type: "select",
    fetchOptions: fetchSecretariasData,
  },
  {
    key: "direccion",
    label: "Organismo administrativo",
    type: "select",
    fetchOptions: (secretaria) => fetchDireccionesData(secretaria),
    dependsOn: "secretaria",
  },
  {
    key: "start_job_date",
    label: "Rango de contratación",
    type: "date-range",
  },
  {
    key: "end_job_date",
    label: "Rango de terminación",
    type: "date-range",
  },
];
