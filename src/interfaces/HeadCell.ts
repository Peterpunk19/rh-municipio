export interface HeadCell {
  disablePadding: boolean;
  id: string;
  label: string;
  concatValues?: any[];
  numeric: boolean;
  empty_text?: string;
  children?: HeadCell[];
  itemsEmployeeIncident?: HeadCellEmployeeIncident[];
}

export interface HeadCellEmployeeIncident {
  id: string;
  active: boolean;
  incident: {
    id: string;
    name: string;
    display_name: string;
    display_time_on_calendar: boolean;
    bgColorOnCalendar: string;
    colorOnCalendar: null;
  };
  incident_status: {
    id: string;
    name: string;
    display_name: string;
  };
}
