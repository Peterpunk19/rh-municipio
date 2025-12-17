import { createEmployeeSeed } from "@/app/api/employee-payroll/tests/seeds/helpers/createEmployee";
import { createAttendance } from "@/app/api/employee-payroll/tests/seeds/helpers/createAttendance";
import { generateIntercalatedAttendances } from "@/app/api/employee-payroll/tests/seeds/helpers/generateIntercalatedAttendances";

export default async function seedIntercalated_LMV_OmisionEntrada(numberEmployee: string) {
  const { employee, location, ascription, employeeAttendanceType } = await createEmployeeSeed({
    numberEmployee,
    name: "Intercalated_OmisionEntrada",
    attendanceType: "intercalated",
  });

  const results = await generateIntercalatedAttendances({
    employeeId: employee.id,
    locationId: location.id,
    ascriptionId: ascription.id,
    attendanceTypeId: employeeAttendanceType.id,
    scheduleDays: ["2025-12-01", "2025-12-03", "2025-12-05", "2025-12-08", "2025-12-10", "2025-12-12", "2025-12-15"],
    excludeDays: ["2025-12-01"],
    jornada: {
      startHourId: 17,
      endHourId: 33,
      checkIn: "08:00",
      checkOut: "16:00",
    },
  });

  const calendarDayId = results.find((r) => r.date === "2025-12-01")?.calendarId;

  await createAttendance(employee.id, location.id, ascription.id, employeeAttendanceType.id, {
    checkOut: "2025-12-01T16:00",
    jobScheduleCalendarId: calendarDayId,
  });
}
