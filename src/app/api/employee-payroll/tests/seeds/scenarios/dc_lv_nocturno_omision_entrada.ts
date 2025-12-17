import { createEmployeeSeed } from "@/app/api/employee-payroll/tests/seeds/helpers/createEmployee";
import { createAttendance } from "@/app/api/employee-payroll/tests/seeds/helpers/createAttendance";
import { generateMonthlyAttendances } from "@/app/api/employee-payroll/tests/seeds/helpers/generateAttendances";

export default async function seedDC_LV_Nocturno_OmisionEntrada(numberEmployee: string) {
  const { employee, location, ascription, employeeAttendanceType } = await createEmployeeSeed({
    numberEmployee,
    name: "DC_Nocturno_OmisionEntrada",
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
    excludeDays: ["2025-12-03"],
    jornadas: {
      lunesViernes: {
        weekdays: [1, 2, 3, 4, 5],
        startDay: 1,
        endDay: 5,
        startHourId: 43,
        endHourId: 15,
        checkIn: "21:00",
        checkOut: "07:00",
      },
    },
  });

  const scheduleId = scheduleMap["lunesViernes"];

  // Omision de entrada dia 03
  await createAttendance(employee.id, location.id, ascription.id, employeeAttendanceType.id, {
    checkOut: "2025-12-04T07:00",
    jobScheduleEmployeeId: scheduleId,
  });
}
