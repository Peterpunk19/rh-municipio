import type { HeadCell } from "@/interfaces/HeadCell";

export const header: readonly HeadCell[] = [
  {
    id: "fullname",
    numeric: false,
    disablePadding: false,
    label: "Nombre",
    children: [
      {
        id: "employeeTypeDisplayName",
        numeric: false,
        disablePadding: false,
        label: "Categoria",
      },
      {
        id: "numberEmployee",
        numeric: false,
        disablePadding: false,
        label: "Numero de empleado",
      },
    ],
  },
  {
    id: "secretariaDisplayName",
    numeric: false,
    disablePadding: false,
    label: "Organismo",
    children: [
      {
        id: "direccionDisplayName",
        numeric: false,
        disablePadding: false,
        label: "Direccion",
      },
      {
        id: "categoryDisplayName",
        numeric: false,
        disablePadding: false,
        label: "Categoria",
      },
    ],
  },
  {
    id: "salarioBase",
    numeric: false,
    disablePadding: false,
    label: "Salario Base",
  },
  {
    id: "salarioAjustado",
    numeric: false,
    disablePadding: false,
    label: "Salario Ajustado",
  },
  {
    id: "salarioFinal",
    numeric: false,
    disablePadding: false,
    label: "Salario Final",
  },
  {
    id: "diasPeriodo",
    numeric: false,
    disablePadding: false,
    label: "Dias trabajados",
  },
  {
    id: "discountSummary.totalFaltas",
    numeric: false,
    disablePadding: false,
    label: "Total incidencias",
  },
  {
    id: "diasAPagar",
    numeric: false,
    disablePadding: false,
    label: "Dias a pagar",
  },
  {
    id: "discountSummary.faltasDirectas",
    numeric: false,
    disablePadding: false,
    label: "Faltas",
  },
  {
    id: "discountSummary.faltasPorOmisiones",
    numeric: false,
    disablePadding: false,
    label: "Omisiones",
  },
  {
    id: "discountSummary.faltasPorInasistencias",
    numeric: false,
    disablePadding: false,
    label: "Inasistencias",
  },
  {
    id: "discountSummary.permisosSinGoce",
    numeric: false,
    disablePadding: false,
    label: "Permiso sin goce",
  },
  {
    id: "discountSummary.faltasPorRetardoNormal",
    numeric: false,
    disablePadding: false,
    label: "Retardo Normal",
  },
  {
    id: "discountSummary.faltasPorRetardoMayor",
    numeric: false,
    disablePadding: false,
    label: "Retardo Mayor",
  },
  {
    id: "incapacitySummary.totalDiasIncapacidad",
    numeric: false,
    disablePadding: false,
    label: "Incapacidades",
  },
];
