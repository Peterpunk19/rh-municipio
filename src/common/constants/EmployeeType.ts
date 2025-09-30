export const EmployeeTypeName = {
  BASE_SINDICALIZADO: "base_sindicalizado",
  BASE_NO_SINDICALIZADO: "base_no_sindicalizado",
  CONFIANZA: "confianza",
  CONTRATO_GASTO_CORRIENTE: "contrato_gasto_corriente",
  CONTRATO_LAUDO: "contrato_por_laudo",
  CONTRATO_FONDO_IV: "contrato_fondo_iv",
  EVENTUAL: "eventual",
  BASE_POR_LAUDO: "base_por_laudo",
  CONFIANZA_FONDO_IV: "confianza_fondo_iv",
  PENSIONADO: "pensionado",
} as const;

export const EmployeeTypeDisplayName: Record<(typeof EmployeeTypeName)[keyof typeof EmployeeTypeName], string> = {
  base_sindicalizado: "BASE SINDICALIZADO",
  base_no_sindicalizado: "BASE NO SINDICALIZADO",
  confianza: "CONFIANZA",
  contrato_gasto_corriente: "CONTRATO DE GASTO CORRIENTE",
  contrato_por_laudo: "CONTRATO POR LAUDO",
  contrato_fondo_iv: "CONTRATO DE FONDO IV",
  eventual: "EVENTUAL",
  base_por_laudo: "NO BASE_POR_LAUDO",
  confianza_fondo_iv: "CONFIANZA_FONDO_IV",
  pensionado: "PENSIONADO",
};
