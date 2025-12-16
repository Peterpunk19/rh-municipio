import { Temporal } from "@js-temporal/polyfill";

export type IAttendance = {
  id: number;
  check_in: string;
  check_out: string;
  employee_attendance_incident: any;
};

export type IAttendanceCalendar = {
  id: number;
  checkIn: string | null;
  checkOut: string | null;
  incidents: {
    id: number;
    type: string;
    name: string;
    displayTimeOnCalendar?: boolean;
    bgColorOnCalendar?: string;
    colorOnCalendar?: string;
    status: string;
  };
  hasIncidents?: boolean;
};

export type ICalendarDay = {
  date: Temporal.PlainDate;
  isInMonth: boolean;
};

export interface IScheduleData {
  startHourId: number;
  endHourId: number;
  startDisplay: string;
  endDisplay: string;
}

export interface ICustomCalendarProps {
  onSave?: (selectedDates: string[]) => void;
  onCancel?: () => void;
  maxSelections?: number;
  daysSelected?: string[];
  onMonthVisibleChange?: (year: number, month: number) => void;
  clearOnMonthChange?: boolean;
  showAttendanceDetails?: boolean;
  employeeId?: string;
  onDateClick?: (date: string) => void;
  initialMonth?: number;
  initialYear?: number;
  hideActions?: boolean;
  enableAttendanceToggle?: boolean;
  scheduleData?: Map<string, IScheduleData>;
  onScheduleClick?: (date: string, schedule: IScheduleData) => void;
}
