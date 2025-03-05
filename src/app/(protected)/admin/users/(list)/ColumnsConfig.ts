import type { ColumnTypeConfig } from "@/interfaces/ColumnTypeConfig";

export const columnTypeConfig: Record<string, ColumnTypeConfig> = {
  username: { renderType: "text" },
  name: { renderType: "text" },
  paternal_last_name: { renderType: "text" },
  maternal_last_name: { renderType: "text" },
  role_display_name: { renderType: "text" },
  active_display_name: { renderType: "text" },
  actions: { renderType: "action", redirectPath: "/admin/users/" },
};
