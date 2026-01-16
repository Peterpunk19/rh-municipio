import { createIncapacityScenario } from "@/app/api/employee-payroll/tests/seeds/helpers/incapacityScenario.helper";

export async function seedAL_Incapacidad_1a5_30Dias(numberEmployee: string) {
  await createIncapacityScenario({
    numberEmployee: numberEmployee,
    name: "AL_Incapacidad_1a5_30d",
    attendanceType: "attendance_list",
    antiguedad: { years: 2, months: 6 },
    totalDays: 30,
    paymentScheme: [{ days: 30, percentage: 100 }],
  });
}
