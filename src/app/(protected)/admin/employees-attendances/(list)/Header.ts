import type { HeadCell } from "@/interfaces/HeadCell";

export const header: readonly HeadCell[] = [
  {
    id: "organism_public.display_name",
    numeric: false,
    disablePadding: false,
    label: "Organismo público y administrativo",
    children: [
      {
        id: "organism_administrative.display_name",
        numeric: false,
        disablePadding: false,
        label: "Organismo administrativo",
      },
    ],
  },
  {
    id: "employee.name",
    concatValues: ["employee.paternal_last_name", "employee.maternal_last_name"],
    numeric: false,
    disablePadding: false,
    label: "Empleado",
    children: [
      {
        id: "employee.curp",
        numeric: false,
        disablePadding: false,
        label: "CURP",
      },
      {
        id: "employee.rfc",
        numeric: false,
        disablePadding: false,
        label: "RFC",
      },
    ],
  },
  {
    id: "type_attendance.display_name",
    numeric: false,
    disablePadding: false,
    label: "Asistencia",
  },
  {
    id: "location.display_name",
    numeric: false,
    disablePadding: false,
    label: "Ubicación",
  },
  {
    id: "check_in",
    numeric: false,
    disablePadding: false,
    label: "Fecha de entrada",
  },
  {
    id: "check_out",
    numeric: false,
    disablePadding: false,
    label: "Fecha de salida",
  },
  {
    id: "created_at",
    numeric: false,
    disablePadding: false,
    label: "Fecha de creación",
  },
  {
    id: "actions",
    numeric: false,
    disablePadding: false,
    label: "Acciones",
  },
];
