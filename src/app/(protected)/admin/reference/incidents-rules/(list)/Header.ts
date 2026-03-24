import type { HeadCell } from "@/interfaces/HeadCell";

export const header: readonly HeadCell[] = [
  {
    id: "employee_type.display_name",
    numeric: false,
    disablePadding: false,
    label: "Tipo de empleado",
  },
  {
    id: "incident.display_name",
    numeric: false,
    disablePadding: false,
    label: "Tipo de incidencia",
  },
  {
    id: "min_days",
    numeric: false,
    disablePadding: false,
    label: "Minimo de Días",
  },
  {
    id: "max_days",
    numeric: false,
    disablePadding: false,
    label: "Máximo de Días",
  },
  {
    id: "start_date",
    numeric: false,
    disablePadding: false,
    label: "De",
  },
  {
    id: "end_date",
    numeric: false,
    disablePadding: false,
    label: "Hasta",
  },
  {
    id: "min_years",
    numeric: false,
    disablePadding: false,
    label: "Años de Servicio (Min)",
  },
  {
    id: "max_years",
    numeric: false,
    disablePadding: false,
    label: "Años de Servicio (Max)",
  },
];
