import type { ColumnTypeConfig } from "@/interfaces/ColumnTypeConfig";

export const columnTypeConfig: Record<string, ColumnTypeConfig> = {
  folio: { renderType: "text" },
  "incident_status.display_name": { renderType: "text" },
  "employee.name": { renderType: "text" },
  "incident.display_name": { renderType: "incidentType" },
  start_date: { renderType: "date" },
  end_date: { renderType: "date" },
  created_at: { renderType: "date" },
  actions: { renderType: "action", redirectPath: "/admin/employees-incidents/" },
  detail: { renderType: "detail" },
};
