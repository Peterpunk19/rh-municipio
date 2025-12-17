import { createEmployeeSeed } from "@/app/api/employee-payroll/tests/seeds/helpers/createEmployee";
import { createWeeklySchedule } from "@/app/api/employee-payroll/tests/seeds/helpers/createSchedule";
import { createAttendance } from "@/app/api/employee-payroll/tests/seeds/helpers/createAttendance";
import { createIncident } from "@/app/api/employee-payroll/tests/seeds/helpers/createIncident";
import { generateMonthlyAttendances } from "@/app/api/employee-payroll/tests/seeds/helpers/generateAttendances";

export default async function seedDC_Complex_RetardoMayorPermisoSinGoce(numberEmployee: string) {
  const { employee, location, ascription, employeeAttendanceType } = await createEmployeeSeed({
    numberEmployee: numberEmployee,
    name: "DC_Complex_RetardoMayorPermisoSinGoce",
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
    excludeDays: ["2025-12-03", "2025-12-15"],
    jornadas: {
      lunesMartes: {
        weekdays: [1, 2],
        startDay: 1,
        endDay: 2,
        startHourId: 17,
        endHourId: 33,
        checkIn: "08:00",
        checkOut: "16:00",
      },
      miercoles: {
        weekdays: [3],
        startDay: 3,
        endDay: 3,
        startHourId: 43,
        endHourId: 15,
        checkIn: "21:00",
        checkOut: "07:00",
      },
      viernesSabadoDomingo: {
        weekdays: [5, 6, 0],
        startDay: 5,
        endDay: 7,
        startHourId: 31,
        endHourId: 43,
        checkIn: "15:00",
        checkOut: "21:00",
      },
    },
  });

  const scheduleLunesMartesId = scheduleMap["lunesMartes"];
  const scheduleMiercolesId = scheduleMap["miercoles"];
  const scheduleViernesSabadoDomingoId = scheduleMap["viernesSabadoDomingo"];

  await createIncident(
    employee.id,
    location.id,
    ascription.id,
    employeeAttendanceType.id,
    "retardo_mayor",
    "2025-12-03",
    "2025-12-03T21:20:00",
    "2025-12-04T07:00:00",
    scheduleMiercolesId,
  );

  await createIncident(
    employee.id,
    location.id,
    ascription.id,
    employeeAttendanceType.id,
    "permiso_sin_goce",
    "2025-12-15",
    "2025-12-15T08:20:00",
    "2025-12-15T16:00:00",
    scheduleLunesMartesId,
  );
}
