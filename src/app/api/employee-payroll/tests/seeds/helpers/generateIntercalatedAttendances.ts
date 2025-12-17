import dayjs from "dayjs";
import { createCalendarDay } from "./createCalendar";
import { createAttendance } from "./createAttendance";

/**
 * Genera asistencias para horarios intercalados usando calendar days.
 *
 * @param scheduleDays Array de fechas calendarizadas (YYYY-MM-DD)
 * @param jornada Objeto con startHourId, endHourId, checkIn, checkOut
 */
export async function generateIntercalatedAttendances({
  employeeId,
  locationId,
  ascriptionId,
  attendanceTypeId,
  scheduleDays = [],
  excludeDays = [],
  jornada,
}) {
  const results = [];

  for (const day of scheduleDays) {
    const date = dayjs(day);

    // Combinar fecha + hora
    const calendarCheckIn = `${day}T${jornada.checkIn}:00`;
    const calendarCheckOut =
      jornada.startHourId > jornada.endHourId
        ? `${date.add(1, "day").format("YYYY-MM-DD")}T${jornada.checkOut}:00`
        : `${day}T${jornada.checkOut}:00`;

    // 1️⃣ Crear siempre el Calendar Day
    const calendarDay = await createCalendarDay(employeeId, day, {
      startHourId: jornada.startHourId,
      endHourId: jornada.endHourId,
      checkIn: calendarCheckIn,
      checkOut: calendarCheckOut,
    });

    // 2️⃣ Crear asistencia SOLO si no está excluido
    if (!excludeDays.includes(day)) {
      await createAttendance(employeeId, locationId, ascriptionId, attendanceTypeId, {
        checkIn: calendarCheckIn,
        checkOut: calendarCheckOut,
        jobScheduleCalendarId: calendarDay.id,
      });
    }

    results.push({
      date: day,
      calendarId: calendarDay.id,
    });
  }

  return results;
}
