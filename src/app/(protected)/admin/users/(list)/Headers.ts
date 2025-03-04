import type { HeadCell } from "@/interfaces/HeadCell";

export const header: readonly HeadCell[] = [
  {
    id: "id",
    numeric: false,
    disablePadding: false,
    label: "ID",
  },
  {
    id: "username",
    numeric: false,
    disablePadding: false,
    label: "Usuario",
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
    id: "role_display_name",
    numeric: false,
    disablePadding: false,
    label: "Rol",
  },
  {
    id: "active_display_name",
    numeric: false,
    disablePadding: false,
    label: "Estatus",
  },
  {
    id: "actions",
    numeric: false,
    disablePadding: false,
    label: "Acciones",
  },
];
