import { createEmployeeSeed } from "@/app/api/employee-payroll/tests/seeds/helpers/createEmployee";
import { createCalendarDay } from "@/app/api/employee-payroll/tests/seeds/helpers/createCalendar";

/**
 * Intercalated — Falta triple (domingo)
 *
 * Reglas:
 *  - El horario se valida con JobScheduleCalendar.
 *  - Si el día está calendarizado pero NO existe asistencia (sin check_in ni check_out),
 *    se considera FALTA.
 *  - Como es domingo → la falta equivale a 3 días de descuento.
 *
 * Día usado: Domingo 2025-12-07.
 */
export default async function seedIntercalated_FaltaTripleDomingo(numberEmployee: string) {
  const { employee } = await createEmployeeSeed({
    numberEmployee,
    name: "Intercalated_FaltaTripleDomingo",
    attendanceType: "intercalated",
  });

  const jornada = {
    startHourId: 15,
    endHourId: 31,
    checkIn: "T07:00:00",
    checkOut: "T15:00:00",
  };

  // Días esperados
  await createCalendarDay(employee.id, "2025-12-07", jornada);

  //
  // IMPORTANTE:
  // ❌ NO creamos ningún registro en EmployeeAttendance
  //
  // Esto provoca:
  // - Inasistencia total en día calendarizado
  // - Se genera FALTA
  // - Como es domingo → Falta Triple = 3 días descontados
  //

  console.log(`🚫 Intercalated_FaltaDobleSabado creado para ${numberEmployee}`);
}
