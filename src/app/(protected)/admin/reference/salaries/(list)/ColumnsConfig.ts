import type { ColumnTypeConfig } from "@/interfaces/ColumnTypeConfig";

export const columnTypeConfig: Record<string, ColumnTypeConfig> = {
  category: { renderType: "text" },
  base_sindicalizado: { renderType: "currency" },
  base_no_sindicalizado: { renderType: "currency" },
  confianza: { renderType: "currency" },
  contrato_gasto_corriente: { renderType: "currency" },
  contrato_laudo: { renderType: "currency" },
  contrato_fondo_iv: { renderType: "currency" },
};
