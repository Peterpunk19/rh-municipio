import dayjs from "dayjs";
import { createWeeklySchedule } from "./createSchedule";
import { createAttendance } from "./createAttendance";

/**
 * Genera asistencias mensuales por jornadas hasta un día específico.
 *
 * @param year Año (ej: 2025)
 * @param month Mes (ej: 12)
 * @param untilDay Último día que se desea generar (ej: 15)
 * @param excludeDays Fechas en formato YYYY-MM-DD que NO deben generarse
 */
export async function generateMonthlyAttendances({
  employeeId,
  locationId,
  ascriptionId,
  attendanceTypeId,
  year,
  month,
  untilDay,
  excludeDays = [],
  jornadas,
  createAttendances = true,
}) {
  const results = [];

  const totalDaysInMonth = dayjs(`${year}-${month}-01`).daysInMonth();
  const maxDay = Math.min(untilDay, totalDaysInMonth);

  const scheduleMap = {};

  // 1️⃣ Crear los horarios semanales (job_schedule_employee)
  for (const key of Object.keys(jornadas)) {
    const j = jornadas[key];

    const schedule = await createWeeklySchedule(employeeId, {
      startDay: j.startDay,
      endDay: j.endDay,
      startHourId: j.startHourId,
      endHourId: j.endHourId,
    });

    scheduleMap[key] = schedule.id;
  }

  if (!createAttendances) {
    return { results: [], scheduleMap };
  }

  // 2️⃣ Generar asistencias día por día
  for (let day = 1; day <= maxDay; day++) {
    const date = dayjs(`${year}-${month}-${String(day).padStart(2, "0")}`);
    const dateStr = date.format("YYYY-MM-DD");
    const weekday = date.day();

    // ❌ Omitir días excluidos
    if (excludeDays.includes(dateStr)) continue;

    // Revisar cada jornada (lunes, miércoles, viernes, etc.)
    for (const key of Object.keys(jornadas)) {
      const j = jornadas[key];

      if (j.weekdays.includes(weekday)) {
        // 🔥 Detectar turno nocturno automáticamente
        const isNightShift = j.startHourId > j.endHourId;

        const checkInDate = `${dateStr}T${j.checkIn}`;

        // Si es nocturno, la salida es al día siguiente
        const checkOutDate = isNightShift
          ? `${date.add(1, "day").format("YYYY-MM-DD")}T${j.checkOut}`
          : `${dateStr}T${j.checkOut}`;

        await createAttendance(employeeId, locationId, ascriptionId, attendanceTypeId, {
          checkIn: checkInDate,
          checkOut: checkOutDate,
          jobScheduleEmployeeId: scheduleMap[key],
        });

        results.push({
          date: dateStr,
          scheduleId: scheduleMap[key],
          isNightShift,
        });
      }
    }
  }

  return { results, scheduleMap };
}
