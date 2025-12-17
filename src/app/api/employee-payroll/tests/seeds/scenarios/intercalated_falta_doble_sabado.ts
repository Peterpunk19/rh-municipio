import { createEmployeeSeed } from "@/app/api/employee-payroll/tests/seeds/helpers/createEmployee";
import { createCalendarDay } from "@/app/api/employee-payroll/tests/seeds/helpers/createCalendar";

/**
 * Intercalated — Falta doble por sábado
 *
 * Reglas:
 *  - El horario se valida con JobScheduleCalendar.
 *  - Si el día está calendarizado pero NO existe asistencia (ni check_in ni check_out),
 *    se considera FALTA.
 *  - Como el día es sábado → la falta equivale a 2 días de descuento.
 *
 * Día usado: Sábado 2025-12-06.
 */
export default async function seedIntercalated_FaltaDobleSabado(numberEmployee: string) {
  const { employee } = await createEmployeeSeed({
    numberEmployee,
    name: "Intercalated_FaltaDobleSabado",
    attendanceType: "intercalated",
  });

  const jornada = {
    startHourId: 15,
    endHourId: 31,
    checkIn: "T07:00:00",
    checkOut: "T15:00:00",
  };
  // Días esperados
  await createCalendarDay(employee.id, "2025-12-06", jornada);

  //
  // IMPORTANTE:
  // ❌ NO creamos ningún registro en EmployeeAttendance
  //
  // Esto provoca automáticamente:
  // - Inasistencia total en un día calendarizado
  // - Falta
  // - Como es sábado → Falta Doble = 2 días descontados
  //

  console.log(`🚫 Intercalated_FaltaDobleSabado creado para ${numberEmployee}`);
}
