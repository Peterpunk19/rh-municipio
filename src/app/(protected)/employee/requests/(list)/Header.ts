import type { HeadCell } from "@/interfaces/HeadCell";

export const header: readonly HeadCell[] = [
  {
    id: "oficio",
    numeric: false,
    disablePadding: false,
    label: "Oficio",
  },
  {
    id: "request.displayName",
    numeric: false,
    disablePadding: false,
    label: "Tipo de Solicitud",
  },
  {
    id: "requestStatus.displayName",
    numeric: false,
    disablePadding: false,
    label: "Estado",
  },
  {
    id: "requestDate",
    numeric: false,
    disablePadding: false,
    label: "Fecha de Solicitud",
  },
  {
    id: "createdAt",
    numeric: false,
    disablePadding: false,
    label: "Fecha de Creación",
  },
  {
    id: "detail",
    numeric: false,
    disablePadding: false,
    label: "Detalle",
  },
];
