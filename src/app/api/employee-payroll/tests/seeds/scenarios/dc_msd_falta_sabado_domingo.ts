import { createEmployeeSeed } from "@/app/api/employee-payroll/tests/seeds/helpers/createEmployee";
import { createWeeklySchedule } from "@/app/api/employee-payroll/tests/seeds/helpers/createSchedule";
import { createAttendance } from "@/app/api/employee-payroll/tests/seeds/helpers/createAttendance";
import { createIncident } from "@/app/api/employee-payroll/tests/seeds/helpers/createIncident";
import { generateMonthlyAttendances } from "@/app/api/employee-payroll/tests/seeds/helpers/generateAttendances";

export default async function seedDC_MSD_FaltaSabadoDomingo(numberEmployee: string) {
  const { employee, location, ascription, employeeAttendanceType } = await createEmployeeSeed({
    numberEmployee: numberEmployee,
    name: "DC_MSD_FaltaSabadoDomingo",
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
    excludeDays: ["2025-12-06", "2025-12-07"],
    jornadas: {
      miercoles: {
        weekdays: [3],
        startDay: 3,
        endDay: 3,
        startHourId: 17,
        endHourId: 33,
        checkIn: "08:00",
        checkOut: "16:00",
      },
      sabadoDomingo: {
        weekdays: [6, 0],
        startDay: 6,
        endDay: 7,
        startHourId: 17,
        endHourId: 33,
        checkIn: "08:00",
        checkOut: "16:00",
      },
    },
  });

  const scheduleSabadoDomingoId = scheduleMap["sabadoDomingo"];

  // Sabado 2025-12-06 falta
  await createIncident(
    employee.id,
    location.id,
    ascription.id,
    employeeAttendanceType.id,
    "falta",
    "2025-12-06",
    "2025-12-06T08:00:00",
    "2025-12-07T16:00:00",
    scheduleSabadoDomingoId,
  );

  // Domingo 2025-12-07 falta
  await createIncident(
    employee.id,
    location.id,
    ascription.id,
    employeeAttendanceType.id,
    "falta",
    "2025-12-07",
    "2025-12-07T08:00:00",
    "2025-12-08T16:00:00",
    scheduleSabadoDomingoId,
  );
}
