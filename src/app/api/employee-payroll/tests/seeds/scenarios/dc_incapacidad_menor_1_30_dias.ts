import { createIncapacityScenario } from "@/app/api/employee-payroll/tests/seeds/helpers/incapacityScenario.helper";

export async function seedDC_IncapacidadMenor1Anio_30Dias(numberEmployee: string) {
  await createIncapacityScenario({
    numberEmployee: numberEmployee,
    name: "DC_Incapacidad_<1a_30d",
    attendanceType: "digital_clock",
    antiguedad: { years: 0, months: 6 },
    totalDays: 30,
    paymentScheme: [
      { days: 15, percentage: 100 },
      { days: 15, percentage: 50 },
    ],
  });
}
