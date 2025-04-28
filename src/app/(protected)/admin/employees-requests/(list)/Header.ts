import type { HeadCell } from "@/interfaces/HeadCell";

export const header: readonly HeadCell[] = [
  {
    id: "folio",
    numeric: false,
    disablePadding: false,
    label: "Folio",
  },
  {
    id: "employee.name",
    concatValues: ["employee.paternalLastName", "employee.maternalLastName"],
    numeric: false,
    disablePadding: false,
    label: "Empleado",
    children: [
      {
        id: "employee.numberEmployee",
        numeric: false,
        disablePadding: false,
        label: "Número de Empleado",
      },
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
    id: "actions",
    numeric: false,
    disablePadding: false,
    label: "Acciones",
  },
];
