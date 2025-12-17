import { ICalendarDay } from "@/components/types";

/* ===========================================================================
   BUILD SCHEDULE MAP
   =========================================================================== */

export function buildScheduleMap(attendanceData: any[], calendar: ICalendarDay[]) {
  const map = new Map<string, { startHour: string; endHour: string }>();

  for (const record of attendanceData) {
    const type = record.employee_attendance_type?.attendance?.name;

    // INTERCALATED
    if (type === "intercalated") {
      for (const d of record.job_schedule_calendar ?? []) {
        const key = d.date.substring(0, 10);
        map.set(key, {
          startHour: d.start_hour.display_name,
          endHour: d.end_hour.display_name,
        });
      }
      continue;
    }

    // DIGITAL CLOCK
    const js = record.job_schedule_employee;
    if (!js) continue;

    const workDays: number[] = [];

    if (js.start_day_id <= js.end_day_id) {
      for (let d = js.start_day_id; d <= js.end_day_id; d++) workDays.push(d);
    } else {
      for (let d = js.start_day_id; d <= 7; d++) workDays.push(d);
      for (let d = 1; d <= js.end_day_id; d++) workDays.push(d);
    }

    for (const cal of calendar) {
      if (workDays.includes(cal.date.dayOfWeek)) {
        const key = cal.date.toString().substring(0, 10);
        map.set(key, {
          startHour: js.start_hour.display_name,
          endHour: js.end_hour.display_name,
        });
      }
    }
  }

  return map;
}

/* ===========================================================================
   SCHEDULE FROM RECORD
   =========================================================================== */

export function getScheduleFromRecord(record: any) {
  const type = record.employee_attendance_type?.attendance?.name;

  if (type === "intercalated" && record.job_schedule_calendar) {
    const c = record.job_schedule_calendar;
    return {
      startHourId: c.start_hour_id,
      endHourId: c.end_hour_id,
    };
  }

  const js = record.job_schedule_employee;
  if (!js) return null;

  return {
    startHourId: js.start_hour_id,
    endHourId: js.end_hour_id,
  };
}

/* ===========================================================================
   CALENDAR DATE RESOLUTION
   =========================================================================== */

export function getCalendarDate(record: any, schedule: { startHourId: number; endHourId: number } | null): string {
  if (!schedule) {
    return record.check_in?.substring(0, 10) || record.check_out?.substring(0, 10) || "";
  }

  const { startHourId, endHourId } = schedule;
  const isNightShift = endHourId < startHourId;

  if (record.check_in) return record.check_in.substring(0, 10);

  if (record.check_out) {
    if (isNightShift) {
      const d = new Date(record.check_out);
      d.setDate(d.getDate() - 1);
      return d.toISOString().substring(0, 10);
    }
    return record.check_out.substring(0, 10);
  }

  return "";
}
