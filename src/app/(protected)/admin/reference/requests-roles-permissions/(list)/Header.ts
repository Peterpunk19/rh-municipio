import type { HeadCell } from "@/interfaces/HeadCell";

export const header: readonly HeadCell[] = [
  {
    id: "role.display_name",
    numeric: false,
    disablePadding: false,
    label: "ROL",
  },
  {
    id: "request.display_name",
    numeric: false,
    disablePadding: false,
    label: "TIPO DE SOLICITUD",
  },
  {
    id: "can_view",
    numeric: false,
    disablePadding: false,
    label: "VER",
  },
  {
    id: "can_create",
    numeric: false,
    disablePadding: false,
    label: "CREAR",
  },
  {
    id: "can_approve",
    numeric: false,
    disablePadding: false,
    label: "APROBAR",
  },
  {
    id: "can_reject",
    numeric: false,
    disablePadding: false,
    label: "RECHAZAR",
  },
  {
    id: "can_cancel",
    numeric: false,
    disablePadding: false,
    label: "CANCELAR",
  },
  {
    id: "can_delete",
    numeric: false,
    disablePadding: false,
    label: "ELIMINAR",
  },
  {
    id: "can_edit",
    numeric: false,
    disablePadding: false,
    label: "EDITAR",
  },
  {
    id: "active",
    numeric: false,
    disablePadding: false,
    label: "ESTATUS",
  },
];
