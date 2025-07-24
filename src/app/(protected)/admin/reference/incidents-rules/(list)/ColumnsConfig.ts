import type { ColumnTypeConfig } from "@/interfaces/ColumnTypeConfig";

export const columnTypeConfig: Record<string, ColumnTypeConfig> = {
  "employee_type.display_name": { renderType: "text" },
  "incident.name": { renderType: "text" },
  days: { renderType: "text" },
  start_date: { renderType: "monthName" },
  end_date: { renderType: "monthName" },
  min_years: { renderType: "text" },
  max_years: { renderType: "text" },
};
