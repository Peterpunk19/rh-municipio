export interface ColumnTypeConfig {
  renderType?:
    | "date"
    | "boolean"
    | "currency"
    | "avatar"
    | "action"
    | "text"
    | "dateTime"
    | "detail"
    | "switch"
    | "monthName"
    | "incidentType"
    | "checkIn"
    | "checkOut";
  format?: (value: any, row: any) => React.ReactNode;
  redirectPath?: string;
  switchConfig?: {
    url: string;
    field: string;
    entity: string;
    fetchAction?: (query: string) => any;
  };
}
