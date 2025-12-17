import { createEmployeeSeed } from "@/app/api/employee-payroll/tests/seeds/helpers/createEmployee";
import { createIncident } from "@/app/api/employee-payroll/tests/seeds/helpers/createIncident";
import { generateMonthlyAttendances } from "@/app/api/employee-payroll/tests/seeds/helpers/generateAttendances";

export default async function seedDC_LV_Retardos1(numberEmployee: string) {
  const { employee, location, ascription, employeeAttendanceType } = await createEmployeeSeed({
    numberEmployee: numberEmployee,
    name: "DC_LV_Retardos_1",
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
    excludeDays: ["2025-12-01"],
    jornadas: {
      lunesViernes: {
        weekdays: [1, 2, 3, 4, 5],
        startDay: 1,
        endDay: 5,
        startHourId: 17,
        endHourId: 33,
        checkIn: "08:00",
        checkOut: "16:00",
      },
    },
  });

  const scheduleId = scheduleMap["lunesViernes"];

  // Lunes 01 incidencia retardo
  await createIncident(
    employee.id,
    location.id,
    ascription.id,
    employeeAttendanceType.id,
    "retardo",
    "2025-12-01",
    "2025-12-01T08:20:00",
    "2025-12-01T16:00:00",
    scheduleId,
  );
}
