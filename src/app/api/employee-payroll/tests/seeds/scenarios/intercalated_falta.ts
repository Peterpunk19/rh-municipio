import { createCalendarDay } from "@/app/api/employee-payroll/tests/seeds/helpers/createCalendar";
import { createIncident } from "@/app/api/employee-payroll/tests/seeds/helpers/createIncident";
import { createEmployeeSeed } from "@/app/api/employee-payroll/tests/seeds/helpers/createEmployee";

export default async function seedIntercalated_Falta(numberEmployee: string) {
  const { employee, location, ascription, employeeAttendanceType } = await createEmployeeSeed({
    numberEmployee: numberEmployee,
    name: "Intercalated_Falta",
    attendanceType: "intercalated",
  });

  const jornada = {
    startHourId: 17,
    endHourId: 30,
  };
  // Días esperados
  await createCalendarDay(employee.id, "2025-12-01", jornada);
  await createCalendarDay(employee.id, "2025-12-03", jornada);
  await createCalendarDay(employee.id, "2025-12-04", jornada);

  // Falta en uno de esos días
  const checkIn = "2025-12-04T08:00:00";
  const checkOut = "2025-12-05T14:30:00";

  await createIncident(
    employee.id,
    location.id,
    ascription.id,
    employeeAttendanceType.id,
    "falta",
    "2025-12-04",
    checkIn,
    checkOut,
  );
}
