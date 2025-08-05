export const EmployeeTypeName = {
  BASE_SINDICALIZADO: "base_sindicalizado",
  BASE_NO_SINDICALIZADO: "base_no_sindicalizado",
  CONFIANZA: "confianza",
  CONTRATO: "contrato",
  CONTRATO_LAUDO: "contrato_laudo",
  PROGRAMA_FC: "programa_fc",
  PROGRAMA_FED: "programa_fed",
} as const;

export const EmployeeTypeDisplayName: Record<(typeof EmployeeTypeName)[keyof typeof EmployeeTypeName], string> = {
  base_sindicalizado: "BASE SINDICALIZADO",
  base_no_sindicalizado: "BASE NO SINDICALIZADO",
  confianza: "CONFIANZA",
  contrato: "CONTRATO",
  contrato_laudo: "CONTRATO POR LAUDO",
  programa_fc: "PROGRAMAS GC",
  programa_fed: "PROGRAMAS FED",
};
