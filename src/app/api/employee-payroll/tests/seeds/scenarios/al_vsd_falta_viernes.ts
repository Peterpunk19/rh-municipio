import { createEmployeeSeed } from "@/app/api/employee-payroll/tests/seeds/helpers/createEmployee";
import { createWeeklySchedule } from "@/app/api/employee-payroll/tests/seeds/helpers/createSchedule";
import { createAttendance } from "@/app/api/employee-payroll/tests/seeds/helpers/createAttendance";
import { createIncident } from "@/app/api/employee-payroll/tests/seeds/helpers/createIncident";
import { generateMonthlyAttendances } from "@/app/api/employee-payroll/tests/seeds/helpers/generateAttendances";

export default async function seedAL_VSD_Falta_Viernes(numberEmployee: string) {
  const { employee, location, ascription, employeeAttendanceType } = await createEmployeeSeed({
    numberEmployee: numberEmployee,
    name: "AL_VSD_Falta_Viernes",
    attendanceType: "attendance_list",
  });

  const { scheduleMap } = await generateMonthlyAttendances({
    employeeId: employee.id,
    locationId: location?.id,
    ascriptionId: ascription?.id,
    attendanceTypeId: employeeAttendanceType?.id,
    year: 2025,
    month: 12,
    untilDay: 15,
    createAttendances: false,
    excludeDays: ["2025-12-05"],
    jornadas: {
      viernesSabadoDomingo: {
        weekdays: [5, 6, 7],
        startDay: 5,
        endDay: 7,
        startHourId: 17,
        endHourId: 33,
        checkIn: "08:00",
        checkOut: "16:00",
      },
    },
  });

  const scheduleViernesSabadoDomingoId = scheduleMap["viernesSabadoDomingo"];

  // Miercoles 05 Falta
  await createIncident(
    employee.id,
    location.id,
    ascription.id,
    employeeAttendanceType.id,
    "falta",
    "2025-12-05",
    "2025-12-05T08:00:00",
    "2025-12-05T16:00:00",
    scheduleViernesSabadoDomingoId,
  );
}
