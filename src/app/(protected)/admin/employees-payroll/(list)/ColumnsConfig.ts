import type { ColumnTypeConfig } from "@/interfaces/ColumnTypeConfig";

export const columnTypeConfig: Record<string, ColumnTypeConfig> = {
  fullname: { renderType: "text" },
  category_display_name: { renderType: "text" },
  secretaria_display_name: { renderType: "text" },
  direccion_display_name: { renderType: "text" },
  employee_type_display_name: { renderType: "text" },
  salary: { renderType: "currency" },
  dias_trabajados: { renderType: "text" },
  omision_salida: { renderType: "text" },
};
