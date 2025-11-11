import type { ColumnTypeConfig } from "@/interfaces/ColumnTypeConfig";
import { store } from "@/store/store";

const getConsecutiveNumber = (value: any, row: any): number => {
  const state = store.getState();
  const { page, limit } = state.pagination;
  const items = state.catalogsList.data;
  const rowIndex = items.findIndex((item: any) => item.id === row.id);
  return rowIndex !== -1 ? (page - 1) * limit + rowIndex + 1 : value;
};

const defaultColumnConfig: Record<string, ColumnTypeConfig> = {
  id: {
    renderType: "text",
    format: getConsecutiveNumber,
  },
  display_name: { renderType: "text" },
  active: { renderType: "boolean" },
};

const holidayColumnConfig: Record<string, ColumnTypeConfig> = {
  id: {
    renderType: "text",
    format: getConsecutiveNumber,
  },
  display_name: { renderType: "text" },
  holiday_date: { renderType: "date" },
  validation_date: { renderType: "date" },
  active: { renderType: "boolean" },
};

const requestColumnConfig: Record<string, ColumnTypeConfig> = {
  id: {
    renderType: "text",
    format: getConsecutiveNumber,
  },
  display_name: { renderType: "text" },
  description: { renderType: "text" },
  active: { renderType: "boolean" },
};

const direccionColumnConfig: Record<string, ColumnTypeConfig> = {
  id: {
    renderType: "text",
    format: getConsecutiveNumber,
  },
  secretaria: { renderType: "text" },
  display_name: { renderType: "text" },
  active: { renderType: "boolean" },
};

const columnConfigs: Record<string, Record<string, ColumnTypeConfig>> = {
  holiday: holidayColumnConfig,
  request: requestColumnConfig,
  direccion: direccionColumnConfig,
};

export const getColumnTypeConfig = (catalogName: string): Record<string, ColumnTypeConfig> => {
  return columnConfigs[catalogName] || defaultColumnConfig;
};
