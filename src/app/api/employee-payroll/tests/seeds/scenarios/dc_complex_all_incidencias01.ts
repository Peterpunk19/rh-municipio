import { createEmployeeSeed } from "@/app/api/employee-payroll/tests/seeds/helpers/createEmployee";
import { createAttendance } from "@/app/api/employee-payroll/tests/seeds/helpers/createAttendance";
import { createIncident } from "@/app/api/employee-payroll/tests/seeds/helpers/createIncident";
import { generateMonthlyAttendances } from "@/app/api/employee-payroll/tests/seeds/helpers/generateAttendances";

export default async function seedDC_Complex_AllIncidencias01(numberEmployee: string) {
  const { employee, location, ascription, employeeAttendanceType } = await createEmployeeSeed({
    numberEmployee: numberEmployee,
    name: "seedDC_Complex_AllIncidencias01",
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
    excludeDays: ["2025-12-01", "2025-12-02", "2025-12-03", "2025-12-08", "2025-12-09", "2025-12-10", "2025-12-14"],
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
    "retardo",
    "2025-12-01",
    "2025-12-01T08:20:00",
    "2025-12-01T04:00:00",
    scheduleLunesMartesId,
  );

  await createIncident(
    employee.id,
    location.id,
    ascription.id,
    employeeAttendanceType.id,
    "retardo",
    "2025-12-02",
    "2025-12-02T08:20:00",
    "2025-12-02T04:00:00",
    scheduleLunesMartesId,
  );

  await createIncident(
    employee.id,
    location.id,
    ascription.id,
    employeeAttendanceType.id,
    "retardo",
    "2025-12-03",
    "2025-12-03T21:20:00",
    "2025-12-04T07:00:00",
    scheduleLunesMartesId,
  );

  await createIncident(
    employee.id,
    location.id,
    ascription.id,
    employeeAttendanceType.id,
    "retardo_mayor",
    "2025-12-08",
    "2025-12-08T08:00:00",
    "2025-12-08T16:00:00",
    scheduleLunesMartesId,
  );

  await createAttendance(employee.id, location.id, ascription.id, employeeAttendanceType.id, {
    checkIn: "2025-12-09T08:20",
    jobScheduleEmployeeId: scheduleLunesMartesId,
  });

  await createAttendance(employee.id, location.id, ascription.id, employeeAttendanceType.id, {
    checkOut: "2025-12-11T07:00",
    jobScheduleEmployeeId: scheduleMiercolesId,
  });

  await createIncident(
    employee.id,
    location.id,
    ascription.id,
    employeeAttendanceType.id,
    "permiso_sin_goce",
    "2025-12-14",
    "2025-12-14T21:20:00",
    "2025-12-14T07:00:00",
    scheduleViernesSabadoDomingoId,
  );
}
