export interface ColumnTypeConfig {
  renderType?: "date" | "boolean" | "currency" | "avatar" | "action" | "text" | "dateTime";
  format?: (value: any, row: any) => React.ReactNode;
  redirectPath?: string;
}
