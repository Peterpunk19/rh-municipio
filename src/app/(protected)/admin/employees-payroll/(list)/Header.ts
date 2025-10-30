import type { HeadCell } from "@/interfaces/HeadCell";

export const header: readonly HeadCell[] = [
  {
    id: "fullname",
    numeric: false,
    disablePadding: false,
    label: "Nombre",
    children: [
      {
        id: "employee_type_display_name",
        numeric: false,
        disablePadding: false,
        label: "Categoria",
      },
      {
        id: "number_employee",
        numeric: false,
        disablePadding: false,
        label: "Numero de empleado",
      },
    ],
  },
  {
    id: "secretaria_display_name",
    numeric: false,
    disablePadding: false,
    label: "Organismo",
    children: [
      {
        id: "direccion_display_name",
        numeric: false,
        disablePadding: false,
        label: "Direccion",
      },
      {
        id: "category_display_name",
        numeric: false,
        disablePadding: false,
        label: "Categoria",
      },
    ],
  },
  {
    id: "salary",
    numeric: false,
    disablePadding: false,
    label: "Salario",
  },
  {
    id: "dias_trabajados",
    numeric: false,
    disablePadding: false,
    label: "Dias trabajados",
  },
  {
    id: "total_incidencias",
    numeric: false,
    disablePadding: false,
    label: "Total incidencias",
  },
  {
    id: "dias_a_pagar",
    numeric: false,
    disablePadding: false,
    label: "Dias a pagar",
  },
  {
    id: "permiso_sin_goce",
    numeric: false,
    disablePadding: false,
    label: "Permiso sin goce",
  },
  {
    id: "total_retardos",
    numeric: false,
    disablePadding: false,
    label: "Retardos",
  },
  {
    id: "falta",
    numeric: false,
    disablePadding: false,
    label: "Faltas",
  },
  {
    id: "incapacidad",
    numeric: false,
    disablePadding: false,
    label: "Incapacidades",
  },
];
