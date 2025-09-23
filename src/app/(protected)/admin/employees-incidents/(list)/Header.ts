import type { HeadCell } from "@/interfaces/HeadCell";

export const header: readonly HeadCell[] = [
  {
    id: "folio",
    numeric: false,
    disablePadding: false,
    label: "Folio",
  },
  {
    id: "incident_status.display_name",
    numeric: false,
    disablePadding: false,
    label: "Estatus",
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
    id: "employee.employee_ascriptions[0].direccion.display_name",
    numeric: false,
    disablePadding: false,
    label: "Organismo público y administrativo",
    children: [
      {
        id: "employee.employee_ascriptions[0].direccion.secretaria.display_name",
        numeric: false,
        disablePadding: false,
        label: "CURP",
      },
    ],
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
    id: "actions",
    numeric: false,
    disablePadding: false,
    label: "Acciones",
  },
];
