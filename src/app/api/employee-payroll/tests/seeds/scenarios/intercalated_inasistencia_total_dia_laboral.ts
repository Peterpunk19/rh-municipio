import { createCalendarDay } from "@/app/api/employee-payroll/tests/seeds/helpers/createCalendar";
import { createIncident } from "@/app/api/employee-payroll/tests/seeds/helpers/createIncident";
import { createEmployeeSeed } from "@/app/api/employee-payroll/tests/seeds/helpers/createEmployee";

/**
 * Intercalated — Inasistencia total en día laboral
 *
 * Reglas:
 *  - El horario se valida contra JobScheduleCalendar.
 *  - Si un día laboral (L-V) está calendarizado y NO hay asistencia,
 *    es FALTA normal (1 día descontado).
 *
 * Día usado: Miércoles 2025-12-04.
 */
export default async function seedIntercalated_InasistenciaTotalDiaLaboral(numberEmployee: string) {
  const { employee, location, ascription, employeeAttendanceType } = await createEmployeeSeed({
    numberEmployee: numberEmployee,
    name: "Intercalated_InasistenciaTotal_DiaLaboral",
    attendanceType: "intercalated",
  });

  const jornada = {
    startHourId: 17,
    endHourId: 30,
  };

  // Días esperados
  await createCalendarDay(employee.id, "2025-12-04", jornada);
}
