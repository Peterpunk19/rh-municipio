import { createEmployeeSeed } from "@/app/api/employee-payroll/tests/seeds/helpers/createEmployee";
import { createWeeklySchedule } from "@/app/api/employee-payroll/tests/seeds/helpers/createSchedule";
import { createAttendance } from "@/app/api/employee-payroll/tests/seeds/helpers/createAttendance";
import { createIncident } from "@/app/api/employee-payroll/tests/seeds/helpers/createIncident";
import { generateMonthlyAttendances } from "@/app/api/employee-payroll/tests/seeds/helpers/generateAttendances";

export default async function seedDC_MSD_Inasistencia(numberEmployee: string) {
  const { employee, location, ascription, employeeAttendanceType } = await createEmployeeSeed({
    numberEmployee: numberEmployee,
    name: "DC_MSD_Inasistencia",
    attendanceType: "digital_clock",
  });

  await generateMonthlyAttendances({
    employeeId: employee.id,
    locationId: location.id,
    ascriptionId: ascription.id,
    attendanceTypeId: employeeAttendanceType.id,
    year: 2025,
    month: 12,
    untilDay: 15,
    excludeDays: ["2025-12-03"],
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
}
