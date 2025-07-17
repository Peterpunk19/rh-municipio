import type { ColumnTypeConfig } from "@/interfaces/ColumnTypeConfig";

export const columnTypeConfig: Record<string, ColumnTypeConfig> = {
  folio: { renderType: "text" },
  "employee.name": { renderType: "text" },
  "request.displayName": { renderType: "text" },
  "requestStatus.displayName": { renderType: "text" },
  requestDate: { renderType: "date" },
  createdAt: { renderType: "date" },
  actions: { renderType: "action", redirectPath: "/admin/employees-requests/" },
  detail: { renderType: "detail" },
};
