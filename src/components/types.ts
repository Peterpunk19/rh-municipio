import { Temporal } from "@js-temporal/polyfill";

export type IAttendance = {
  id: number;
  incidentId: number;
  checkIn: string;
  checkOut: string;
  isIncident?: boolean;
  displayTimeOnCalendar?: boolean;
  incidentType?: string;
  bgColorOnCalendar?: string;
  colorOnCalendar?: string;
};

export type ICalendarDay = {
  date: Temporal.PlainDate;
  isInMonth: boolean;
};

export interface ICustomCalendarProps {
  onSave?: (selectedDates: string[]) => void;
  onCancel?: () => void;
  maxSelections?: number;
  daysSelected?: string[];
  onMonthVisibleChange?: (year: number, month: number) => void;
  clearOnMonthChange?: boolean;
  showAttendanceDetails?: boolean;
  employeeId?: string;
}
