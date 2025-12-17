import { createEmployeeSeed } from "@/app/api/employee-payroll/tests/seeds/helpers/createEmployee";
import { createWeeklySchedule } from "@/app/api/employee-payroll/tests/seeds/helpers/createSchedule";
import { createIncident } from "@/app/api/employee-payroll/tests/seeds/helpers/createIncident";
import { createAttendance } from "@/app/api/employee-payroll/tests/seeds/helpers/createAttendance";
import { generateMonthlyAttendances } from "@/app/api/employee-payroll/tests/seeds/helpers/generateAttendances";

export default async function seedDC_LD_RetardoDomingo(numberEmployee: string) {
  const { employee, location, ascription, employeeAttendanceType } = await createEmployeeSeed({
    numberEmployee,
    name: "DC_LD_RetardoDomingo",
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
    excludeDays: ["2025-12-07"],
    jornadas: {
      lunesDomingo: {
        weekdays: [1, 2, 3, 4, 5, 6, 0],
        startDay: 1,
        endDay: 7,
        startHourId: 17,
        endHourId: 33,
        checkIn: "08:00",
        checkOut: "16:00",
      },
    },
  });

  const scheduleLunesDomingoId = scheduleMap["lunesDomingo"];

  await createIncident(
    employee.id,
    location.id,
    ascription.id,
    employeeAttendanceType.id,
    "retardo",
    "2025-12-07",
    "2025-12-07T08:20:00",
    "2025-12-07T16:05:00",
    scheduleLunesDomingoId,
  );
}
