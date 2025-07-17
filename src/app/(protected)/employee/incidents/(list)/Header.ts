import type { HeadCell } from "@/interfaces/HeadCell";

export const header: readonly HeadCell[] = [
  {
    id: "oficio",
    numeric: false,
    disablePadding: false,
    label: "Oficio",
  },
  {
    id: "incident_status.display_name",
    numeric: false,
    disablePadding: false,
    label: "Estatus",
  },
  {
    id: "incident.display_name",
    numeric: false,
    disablePadding: false,
    label: "Tipo de Incidencia",
  },
  {
    id: "start_date",
    numeric: false,
    disablePadding: false,
    label: "Fecha de inicio",
  },
  {
    id: "end_date",
    numeric: false,
    disablePadding: false,
    label: "Fecha de terminación",
  },
  {
    id: "created_at",
    numeric: false,
    disablePadding: false,
    label: "Fecha de creación",
  },
  {
    id: "detail",
    numeric: false,
    disablePadding: false,
    label: "Detalle",
  },
];
