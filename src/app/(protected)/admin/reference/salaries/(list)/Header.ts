import type { HeadCell } from "@/interfaces/HeadCell";

export const header: readonly HeadCell[] = [
  {
    id: "category",
    numeric: false,
    disablePadding: false,
    label: "CATEGORÍA",
  },
  {
    id: "base_sindicalizado",
    numeric: true,
    disablePadding: false,
    label: "BASE SINDICALIZADO",
  },
  {
    id: "base_no_sindicalizado",
    numeric: true,
    disablePadding: false,
    label: "BASE NO SINDICALIZADO",
  },
  {
    id: "confianza",
    numeric: true,
    disablePadding: false,
    label: "CONFIANZA",
  },
  {
    id: "contrato_gasto_corriente",
    numeric: true,
    disablePadding: false,
    label: "CONTRATO DE GASTO CORRIENTE",
  },
  {
    id: "contrato_laudo",
    numeric: true,
    disablePadding: false,
    label: "CONTRATO POR LAUDO",
  },
  {
    id: "contrato_fondo_iv",
    numeric: true,
    disablePadding: false,
    label: "CONTRATO DE FONDO IV",
  },
];
