import { createEmployeeSeed } from "@/app/api/employee-payroll/tests/seeds/helpers/createEmployee";
import { createIncident } from "@/app/api/employee-payroll/tests/seeds/helpers/createIncident";
import { generateMonthlyAttendances } from "@/app/api/employee-payroll/tests/seeds/helpers/generateAttendances";

export default async function seedDC_LMV_Retardos1(numberEmployee: string) {
  const { employee, location, ascription, employeeAttendanceType } = await createEmployeeSeed({
    numberEmployee: numberEmployee,
    name: "DC_LMV_Retardos1",
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
    excludeDays: ["2025-12-05"],
    jornadas: {
      lunes: {
        weekdays: [1],
        startDay: 1,
        endDay: 1,
        startHourId: 17,
        endHourId: 33,
        checkIn: "08:00",
        checkOut: "16:00",
      },
      miercoles: {
        weekdays: [3],
        startDay: 3,
        endDay: 3,
        startHourId: 21,
        endHourId: 41,
        checkIn: "10:00",
        checkOut: "20:00",
      },
      viernes: {
        weekdays: [5],
        startDay: 5,
        endDay: 5,
        startHourId: 43,
        endHourId: 15,
        checkIn: "21:00",
        checkOut: "07:00",
      },
    },
  });

  const scheduleId = scheduleMap["viernes"];

  await createIncident(
    employee.id,
    location.id,
    ascription.id,
    employeeAttendanceType.id,
    "retardo",
    "2025-12-05",
    "2025-12-05T21:20:00",
    "2025-12-06T07:00:00",
    scheduleId,
  );
}
