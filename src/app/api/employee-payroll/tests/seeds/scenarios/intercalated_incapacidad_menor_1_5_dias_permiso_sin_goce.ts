import { createIntercalatedIncapacityScenario } from "@/app/api/employee-payroll/tests/seeds/helpers/incapacityScenario.helper";
import { createIncident } from "@/app/api/employee-payroll/tests/seeds/helpers/createIncident";

export async function seedIntercalated_IncapacidadMenor1Anio_5Dias_PermisoSinGoce(numberEmployee: string) {
  const { employee, location, ascription, employeeAttendanceType, results } =
    await createIntercalatedIncapacityScenario({
      employeeSeed: {
        numberEmployee,
        name: "Intercalated_Incapacidad_<1a_5d_PermisoSinGoce",
        attendanceType: "intercalated",
      },
      antiguedad: { years: 0, months: 6 },
      totalDays: 13,
      paymentScheme: [{ days: 13, percentage: 100 }],
      scheduleDays: ["2026-01-02", "2026-01-05", "2026-01-07", "2026-01-09", "2026-01-12", "2026-01-14"],
      excludeDays: ["2026-01-02", "2026-01-05", "2026-01-07", "2026-01-09", "2026-01-12", "2026-01-14"],
      jornada: {
        startHourId: 17,
        endHourId: 33,
        checkIn: "08:00",
        checkOut: "16:00",
      },
      incident: {
        name: "incapacidad",
      },
    });

  const calendarDayId = results.find((r) => r.date === "2026-01-14")?.calendarId;

  await createIncident(
    employee.id,
    location.id,
    ascription.id,
    employeeAttendanceType.id,
    "permiso_sin_goce",
    "2026-01-14",
    "2026-01-14T08:00:00",
    "2026-01-14T16:00:00",
    null,
    calendarDayId,
  );
}
