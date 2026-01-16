import { createIntercalatedIncapacityScenario } from "@/app/api/employee-payroll/tests/seeds/helpers/incapacityScenario.helper";

export async function seedIntercalated_IncapacidadMenor1Anio_30Dias(numberEmployee: string) {
  await createIntercalatedIncapacityScenario({
    employeeSeed: {
      numberEmployee,
      name: "Intercalated_Incapacidad_<1a_30d",
      attendanceType: "intercalated",
    },
    antiguedad: { years: 0, months: 6 },
    totalDays: 30,
    paymentScheme: [
      { days: 15, percentage: 100 },
      { days: 15, percentage: 50 },
    ],
    scheduleDays: [
      "2026-01-02",
      "2026-01-05",
      "2026-01-07",
      "2026-01-09",
      "2026-01-12",
      "2026-01-14",
      "2026-01-16",
      "2026-01-19",
      "2026-01-21",
      "2026-01-23",
      "2026-01-26",
      "2026-01-28",
      "2026-01-30",
    ],
    excludeDays: [
      "2026-01-02",
      "2026-01-05",
      "2026-01-07",
      "2026-01-09",
      "2026-01-12",
      "2026-01-14",
      "2026-01-16",
      "2026-01-19",
      "2026-01-21",
      "2026-01-23",
      "2026-01-26",
      "2026-01-28",
      "2026-01-30",
    ],
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
}
