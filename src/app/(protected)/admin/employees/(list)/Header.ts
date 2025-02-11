import type { HeadCell } from "@/interfaces/HeadCell";

export const header: readonly HeadCell[] = [
  {
    id: "number_employee",
    numeric: false,
    disablePadding: false,
    label: "Número de empleado",
  },
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Nombre",
  },
  {
    id: "paternal_last_name",
    numeric: false,
    disablePadding: false,
    label: "Apellido Paterno",
  },
  {
    id: "maternal_last_name",
    numeric: false,
    disablePadding: false,
    label: "Apellido Materno",
  },
  {
    id: "rfc",
    numeric: false,
    disablePadding: false,
    label: "RFC",
  },
  {
    id: "curp",
    numeric: false,
    disablePadding: false,
    label: "CURP",
  },
  {
    id: "birthday",
    numeric: false,
    disablePadding: false,
    label: "Fecha de nacimiento",
  },
  {
    id: "gender.display_name",
    numeric: false,
    disablePadding: false,
    label: "Género",
  },
  {
    id: "status_employee.display_name",
    numeric: false,
    disablePadding: false,
    label: "Estatus",
  },
  {
    id: "employee_hiring_active.category.display_name",
    numeric: false,
    disablePadding: false,
    label: "Categoría",
  },
  {
    id: "employee_hiring_active.start_job_date",
    numeric: false,
    disablePadding: false,
    label: "Fecha de contratación",
  },
  {
    id: "location_active.location.display_name",
    numeric: false,
    disablePadding: false,
    label: "Ubicación",
    empty_text: "No hay ubicación",
  },
  {
    id: "employee_hiring_active.direccion.display_name",
    numeric: false,
    disablePadding: false,
    label: "Organo Administrativo",
  },
  {
    id: "employee_hiring_active.direccion.secretaria.display_name",
    numeric: false,
    disablePadding: false,
    label: "Organo Público",
  },
  {
    id: "actions",
    numeric: false,
    disablePadding: false,
    label: "Acciones",
  },
];
