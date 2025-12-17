"use client";

import { useCallback, useState } from "react";
import { StatusCodes } from "http-status-codes";

import { getEmployeesAttendances } from "@/services/employees-attendances";
import { getEmployeeJobSchedule, getEmployeeJobScheduleCalendar } from "@/services/employees";

import { calculateDaysBetweenDates } from "@/common/utils";
import { logger } from "@/lib/logger";

export function useEmployeeCalendarData(employeeId: number) {
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [calendarSchedule, setCalendarSchedule] = useState<any[]>([]);
  const [jobSchedule, setJobSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  /* ===========================================================================
     FETCH ATTENDANCES
   =========================================================================== */

  const fetchEmployeesAttendances = useCallback(
    async (from: string, to: string) => {
      if (!employeeId) return;

      try {
        setLoading(true);

        const res = await getEmployeesAttendances({
          employeeId,
          checkIn: from,
          checkOut: to,
          limit: calculateDaysBetweenDates(from, to),
        });

        if (res.statusCode === StatusCodes.OK) {
          setAttendanceData(res.responseObject.data);
        } else {
          setAttendanceData([]);
        }
      } catch (e) {
        logger.error(e);
        setAttendanceData([]);
      } finally {
        setLoading(false);
      }
    },
    [employeeId],
  );

  /* ===========================================================================
     FETCH TODAS LAS JORNADAS DEL EMPLEADO
   =========================================================================== */

  const fetchJobSchedule = useCallback(async () => {
    if (!employeeId) return;

    try {
      const res = await getEmployeeJobSchedule(employeeId);
      setJobSchedule(res.responseObject ?? []);
    } catch (e) {
      logger.error(e);
      setJobSchedule([]);
    }
  }, [employeeId]);

  /* ===========================================================================
     FETCH DÍAS CALENDARIZADOS (INTERCALATED)
   =========================================================================== */

  const fetchCalendarDays = useCallback(
    async (from: string, to: string) => {
      if (!employeeId) return;

      try {
        const res = await getEmployeeJobScheduleCalendar(employeeId, from, to);
        setCalendarSchedule(res.responseObject || []);
      } catch (e) {
        logger.error(e);
        setCalendarSchedule([]);
      }
    },
    [employeeId],
  );

  return {
    attendanceData,
    calendarSchedule,
    jobSchedule,
    loading,
    actions: {
      fetchEmployeesAttendances,
      fetchJobSchedule,
      fetchCalendarDays,
    },
  };
}
