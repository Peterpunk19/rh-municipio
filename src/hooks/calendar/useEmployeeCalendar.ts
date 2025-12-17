"use client";

import { useEffect, useMemo, useState } from "react";
import { Temporal } from "@js-temporal/polyfill";
import { formatDate } from "@/utils/formatter";
import { IAttendanceCalendar, ICalendarDay } from "@/components/types";
import { buildScheduleMap, getCalendarDate, getScheduleFromRecord } from "@/hooks/calendar/helpers";
import { useEmployeeCalendarData } from "@/hooks/calendar/useEmployeeCalendarData";

export function useEmployeeCalendar(employeeId: number) {
  const today = useMemo(() => Temporal.Now.plainDateISO(), []);
  const days = useMemo(() => ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"], []);

  const [month, setMonth] = useState(today.month);
  const [year, setYear] = useState(today.year);
  const [monthCalendar, setMonthCalendar] = useState<ICalendarDay[]>([]);

  const {
    attendanceData,
    calendarSchedule,
    jobSchedule,
    actions: { fetchEmployeesAttendances, fetchJobSchedule, fetchCalendarDays },
  } = useEmployeeCalendarData(employeeId);

  const attendanceMap = useMemo(() => {
    const map = new Map<string, IAttendanceCalendar>();

    for (const r of attendanceData) {
      const schedule = getScheduleFromRecord(r);
      const date = getCalendarDate(r, schedule);
      if (!date) continue;

      const incidents =
        r.employee_attendance_incident?.map((ai: any) => ({
          id: ai.employee_incident.id,
          type: ai.employee_incident.incident.display_name,
          name: ai.employee_incident.incident.name,
          displayTimeOnCalendar: ai.employee_incident.incident.display_time_on_calendar,
          bgColorOnCalendar: ai.employee_incident.incident.bgColorOnCalendar,
          colorOnCalendar: ai.employee_incident.incident.colorOnCalendar,
          status: ai.employee_incident.incident_status.display_name,
        })) ?? [];

      map.set(date, {
        id: r.id,
        checkIn: r.check_in,
        checkOut: r.check_out,
        incidents,
        hasIncidents: incidents.length > 0,
      });
    }

    return map;
  }, [attendanceData]);

  /* ===========================================================================
     scheduleMap FINAL — PINTA TODAS LAS JORNADAS SIEMPRE
   =========================================================================== */

  const scheduleMap = useMemo(() => {
    const map = buildScheduleMap(attendanceData, monthCalendar);

    // INTERCALATED — fechas definidas manualmente
    for (const d of calendarSchedule) {
      const dateKey = d.date.substring(0, 10);
      map.set(dateKey, {
        startHour: d.start_hour.display_name,
        endHour: d.end_hour.display_name,
      });
    }

    // DIGITAL CLOCK — TODAS LAS JORNADAS SIN ASISTENCIAS
    for (const js of jobSchedule) {
      let workDays: number[] = [];

      if (js.start_day_id <= js.end_day_id) {
        for (let d = js.start_day_id; d <= js.end_day_id; d++) workDays.push(d);
      } else {
        for (let d = js.start_day_id; d <= 7; d++) workDays.push(d);
        for (let d = 1; d <= js.end_day_id; d++) workDays.push(d);
      }

      for (const cal of monthCalendar) {
        const dow = cal.date.dayOfWeek;
        const key = cal.date.toString().substring(0, 10);

        if (workDays.includes(dow) && !map.has(key)) {
          map.set(key, {
            startHour: js.start_hour.display_name,
            endHour: js.end_hour.display_name,
          });
        }
      }
    }

    return map;
  }, [attendanceData, calendarSchedule, monthCalendar, jobSchedule]);

  /* ===========================================================================
     CAMBIO DE MES
   =========================================================================== */

  const next = () => {
    const ym = Temporal.PlainYearMonth.from({ year, month }).add({ months: 1 });
    setMonth(ym.month);
    setYear(ym.year);
  };

  const previous = () => {
    const ym = Temporal.PlainYearMonth.from({ year, month }).subtract({ months: 1 });
    setMonth(ym.month);
    setYear(ym.year);
  };

  /* ===========================================================================
     GENERAR CALENDARIO + FETCH
   =========================================================================== */

  useEffect(() => {
    const start = Temporal.PlainDate.from({ year, month, day: 1 });

    const offset = start.dayOfWeek % 7;
    const daysInMonth = start.daysInMonth;
    const totalCells = offset + daysInMonth > 35 ? 42 : 35;

    const newCalendar = [...Array(totalCells)].map((_, idx) => ({
      date: start.add({ days: idx - offset }),
      isInMonth: idx >= offset && idx < offset + daysInMonth,
    }));

    setMonthCalendar(newCalendar);

    const from = formatDate(new Date(newCalendar[0].date.toString()), "yyyy-MM-dd");
    const to = formatDate(new Date(newCalendar[newCalendar.length - 1].date.toString()), "yyyy-MM-dd");

    fetchEmployeesAttendances(from, to);
    fetchJobSchedule();
    fetchCalendarDays(from, to);
  }, [month, year, employeeId]);

  return {
    today,
    days,
    month,
    year,
    monthCalendar,
    attendanceMap,
    scheduleMap,
    next,
    previous,
  };
}
