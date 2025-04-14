import type { ColumnTypeConfig } from "@/interfaces/ColumnTypeConfig";
import { formatDate } from "@/utils/formatter";

export const columnTypeConfig: Record<string, ColumnTypeConfig> = {
  "organism_public.display_name": { renderType: "text" },
  "employee.name": { renderType: "text" },
  "type_attendance.display_name": { renderType: "text" },
  "location.display_name": { renderType: "text" },
  check_in: { renderType: "date", format: (value) => formatDate(value, "dd/MM/yyyy HH:mm") },
  check_out: { renderType: "date", format: (value) => formatDate(value, "dd/MM/yyyy HH:mm") },
  created_at: { renderType: "date", format: (value) => formatDate(value, "dd/MM/yyyy HH:mm") },
  actions: { renderType: "action", redirectPath: "/admin/employees-attendances/" },
};
