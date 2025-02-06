import { HeadCell } from "@/interfaces/HeadCell";

export const headCells: readonly HeadCell[] = [
  {
    id: "id",
    numeric: false,
    disablePadding: false,
    label: "Id",
  },
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
    id: "actions",
    numeric: false,
    disablePadding: false,
    label: "Acciones",
  },
];
