import type { ColumnTypeConfig } from "@/interfaces/ColumnTypeConfig";

export const columnTypeConfig: Record<string, ColumnTypeConfig> = {
  name: { renderType: "text" },
  paternal_last_name: { renderType: "text" },
  maternal_last_name: { renderType: "text" },
  number_employee: { renderType: "text" },
  "employee_hiring_active.start_job_date": { renderType: "date" },
  birthday: { renderType: "date" },
  actions: { renderType: "action", redirectPath: "/admin/employees/" },
};
