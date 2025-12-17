import { createEmployeeSeed } from "@/app/api/employee-payroll/tests/seeds/helpers/createEmployee";
import { createWeeklySchedule } from "@/app/api/employee-payroll/tests/seeds/helpers/createSchedule";
import { createIncident } from "@/app/api/employee-payroll/tests/seeds/helpers/createIncident";
import { createAttendance } from "@/app/api/employee-payroll/tests/seeds/helpers/createAttendance";
import { generateMonthlyAttendances } from "@/app/api/employee-payroll/tests/seeds/helpers/generateAttendances";

export default async function seedDC_LS_OmisionSalida(numberEmployee: string) {
  const { employee, location, ascription, employeeAttendanceType } = await createEmployeeSeed({
    numberEmployee,
    name: "DC_LS_OmisionSalida",
    attendanceType: "digital_clock",
  });

  const { scheduleMap } = await generateMonthlyAttendances({
    employeeId: employee.id,
    locationId: location.id,
    ascriptionId: ascription.id,
    attendanceTypeId: employeeAttendanceType.id,
    year: 2025,
    month: 12,
    untilDay: 15,
    excludeDays: ["2025-12-06"],
    jornadas: {
      lunesSabado: {
        weekdays: [1, 2, 3, 4, 5, 6],
        startDay: 1,
        endDay: 6,
        startHourId: 17,
        endHourId: 33,
        checkIn: "08:00",
        checkOut: "16:00",
      },
    },
  });

  const scheduleLunesSabadoId = scheduleMap["lunesSabado"];

  await createAttendance(employee.id, location.id, ascription.id, employeeAttendanceType.id, {
    checkIn: "2025-12-06T08:00",
    jobScheduleEmployeeId: scheduleLunesSabadoId,
  });
}
