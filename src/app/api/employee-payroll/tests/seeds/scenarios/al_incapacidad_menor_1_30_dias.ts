import { createIncapacityScenario } from "@/app/api/employee-payroll/tests/seeds/helpers/incapacityScenario.helper";

export async function seedAL_IncapacidadMenor1Anio_30Dias(numberEmployee: string) {
  await createIncapacityScenario({
    numberEmployee: numberEmployee,
    name: "Incapacidad_<1a_30d",
    attendanceType: "attendance_list",
    antiguedad: { years: 0, months: 6 },
    totalDays: 30,
    paymentScheme: [
      { days: 15, percentage: 100 },
      { days: 15, percentage: 50 },
    ],
  });
}
