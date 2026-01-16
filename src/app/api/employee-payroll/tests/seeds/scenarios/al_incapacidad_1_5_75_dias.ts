import { createIncapacityScenario } from "@/app/api/employee-payroll/tests/seeds/helpers/incapacityScenario.helper";

export async function seedAL_Incapacidad_1a5_75Dias(numberEmployee: string) {
  await createIncapacityScenario({
    numberEmployee: numberEmployee,
    name: "AL_Incapacidad_1a5_75d",
    attendanceType: "attendance_list",
    antiguedad: { years: 2, months: 6 },
    totalDays: 75,
    paymentScheme: [
      { days: 30, percentage: 100 },
      { days: 30, percentage: 50 },
      { days: 15, percentage: 0 },
    ],
  });
}
