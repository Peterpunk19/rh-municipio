import type { HeadCell } from "@/interfaces/HeadCell";

const defaultHeader: readonly HeadCell[] = [
  {
    id: "id",
    numeric: false,
    disablePadding: false,
    label: "ID",
  },
  {
    id: "display_name",
    numeric: false,
    disablePadding: false,
    label: "NOMBRE",
  },
  {
    id: "active",
    numeric: false,
    disablePadding: false,
    label: "ESTATUS",
  },
];

const holidayHeader: readonly HeadCell[] = [
  {
    id: "id",
    numeric: false,
    disablePadding: false,
    label: "ID",
  },
  {
    id: "display_name",
    numeric: false,
    disablePadding: false,
    label: "NOMBRE",
  },
  {
    id: "holiday_date",
    numeric: false,
    disablePadding: false,
    label: "DÍA FESTIVO",
  },
  {
    id: "validation_date",
    numeric: false,
    disablePadding: false,
    label: "DÍA APLICADO",
  },
  {
    id: "active",
    numeric: false,
    disablePadding: false,
    label: "ESTATUS",
  },
];

const requestHeader: readonly HeadCell[] = [
  {
    id: "id",
    numeric: false,
    disablePadding: false,
    label: "ID",
  },
  {
    id: "display_name",
    numeric: false,
    disablePadding: false,
    label: "NOMBRE",
  },
  {
    id: "description",
    numeric: false,
    disablePadding: false,
    label: "DESCRIPCION",
  },
  {
    id: "active",
    numeric: false,
    disablePadding: false,
    label: "ESTATUS",
  },
];

const direccionHeader: readonly HeadCell[] = [
  {
    id: "id",
    numeric: false,
    disablePadding: false,
    label: "ID",
  },
  {
    id: "secretaria.display_name",
    numeric: false,
    disablePadding: false,
    label: "SECRETARIA",
  },
  {
    id: "display_name",
    numeric: false,
    disablePadding: false,
    label: "DIRECCIÓN",
  },
  {
    id: "active",
    numeric: false,
    disablePadding: false,
    label: "ESTATUS",
  },
];

const headerConfigs: Record<string, readonly HeadCell[]> = {
  holiday: holidayHeader,
  request: requestHeader,
  direccion: direccionHeader,
};

export const getHeaderConfig = (catalogName: string): readonly HeadCell[] => {
  return headerConfigs[catalogName] || defaultHeader;
};
