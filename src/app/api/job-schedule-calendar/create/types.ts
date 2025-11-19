export interface ISchedules {
  date: string;
  startHourId: string;
  endHourId: string;
}

export interface IJobScheduleCalendar {
  employees: [];
  schedules: ISchedules[];
}
