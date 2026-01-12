export interface ISchedules {
  date: string;
  startHourId: string;
  endHourId: string;
}

export interface IJobScheduleCalendar {
  employees: number[];
  schedules: ISchedules[];
  from?: string | null;
  to?: string | null;
}
