export interface IJobScheduleCalendarFilters {
  page: number | string;
  limit: number | string;
  search: string | null | undefined;
  from: string | null | undefined;
  to: string | null | undefined;
}
