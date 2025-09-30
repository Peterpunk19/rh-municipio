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
    label: "Empleado",
    concatValues: ["paternal_last_name", "maternal_last_name"],
    children: [
      {
        id: "curp",
        numeric: false,
        disablePadding: false,
        label: "CURP",
      },
      {
        id: "rfc",
        numeric: false,
        disablePadding: false,
        label: "RFC",
      },
    ],
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
    id: "employee_hiring[0].employee_type.display_name",
    numeric: false,
    disablePadding: false,
    label: "Tipo de Empleado y Categoría",
    children: [
      {
        id: "employee_hiring[0].category.display_name",
        numeric: false,
        disablePadding: false,
        label: "Categoría",
      },
      {
        id: "employee_trade_union[0].trade_union.display_name",
        numeric: false,
        disablePadding: false,
        label: "",
      },
    ],
  },
  {
    id: "employee_hiring[0].start_job_date",
    numeric: false,
    disablePadding: false,
    label: "Fecha de alta",
  },
  {
    id: "employee_location[0].location.display_name",
    numeric: false,
    disablePadding: false,
    label: "Ubicación y Tipo de checado",
    empty_text: "No hay ubicación",
    children: [
      {
        id: "employee_attendance_type[0].attendance.display_name",
        numeric: false,
        disablePadding: false,
        label: "Tipo de checado",
      },
    ],
  },
  {
    id: "employee_ascriptions[0].direccion.secretaria.display_name",
    numeric: false,
    disablePadding: false,
    label: "Órgano Público",
    children: [
      {
        id: "employee_ascriptions[0].direccion.display_name",
        numeric: false,
        disablePadding: false,
        label: "Órgano Administrativo",
      },
    ],
  },
  {
    id: "actions",
    numeric: false,
    disablePadding: false,
    label: "Acciones",
  },
  {
    id: "status_employee.display_name",
    numeric: false,
    disablePadding: false,
    label: "Estatus",
  },
];
