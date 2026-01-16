import { prisma } from "@/lib/prisma";
import { createEmployeeSeed } from "@/app/api/employee-payroll/tests/seeds/helpers/createEmployee";
import { generateMonthlyAttendances } from "@/app/api/employee-payroll/tests/seeds/helpers/generateAttendances";
import { createAttendance } from "@/app/api/employee-payroll/tests/seeds/helpers/createAttendance";
import { hiringDateForAntiguedad, startOfCurrentMonth, withTime } from "@/common/utils";
import { createIncapacityScenario } from "@/app/api/employee-payroll/tests/seeds/helpers/incapacityScenario.helper";

export async function seedAL_IncapacidadMenor1Anio_45Dias(numberEmployee: string) {
  await createIncapacityScenario({
    numberEmployee: numberEmployee,
    name: "Incapacidad_<1a_45d",
    attendanceType: "attendance_list",
    antiguedad: { years: 0, months: 6 },
    totalDays: 45,
    paymentScheme: [
      { days: 15, percentage: 100 },
      { days: 15, percentage: 50 },
      { days: 15, percentage: 0 },
    ],
  });
}
