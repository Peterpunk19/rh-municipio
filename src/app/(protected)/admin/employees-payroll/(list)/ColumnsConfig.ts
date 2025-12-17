import type { ColumnTypeConfig } from "@/interfaces/ColumnTypeConfig";

export const columnTypeConfig: Record<string, ColumnTypeConfig> = {
  salarioBase: { renderType: "currency" },
  salarioAjustado: { renderType: "currency" },
  salarioFinal: { renderType: "currency" },
};
