import { createIncapacityScenario } from "@/app/api/employee-payroll/tests/seeds/helpers/incapacityScenario.helper";

export async function seedDC_Incapacidad_1a5_30Dias(numberEmployee: string) {
  await createIncapacityScenario({
    numberEmployee: numberEmployee,
    name: "DC_Incapacidad_1a5_30d",
    attendanceType: "digital_clock",
    antiguedad: { years: 2, months: 6 },
    totalDays: 30,
    paymentScheme: [{ days: 30, percentage: 100 }],
  });
}
