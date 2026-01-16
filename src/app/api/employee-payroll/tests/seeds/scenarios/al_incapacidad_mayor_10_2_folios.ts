import { prisma } from "@/lib/prisma";
import { createEmployeeSeed } from "@/app/api/employee-payroll/tests/seeds/helpers/createEmployee";
import { generateMonthlyAttendances } from "@/app/api/employee-payroll/tests/seeds/helpers/generateAttendances";
import { createIncident } from "@/app/api/employee-payroll/tests/seeds/helpers/createIncident";
import { createIncapacityScenario } from "@/app/api/employee-payroll/tests/seeds/helpers/incapacityScenario.helper";

export async function seedAL_IncapacidadMayor10_2FoliosContinuos(numberEmployee: string) {
  const { employee } = await createEmployeeSeed({
    numberEmployee,
    name: "AL_Incapacidad_>10a_continua",
    attendanceType: "attendance_list",
  });

  await prisma.employeeHiring.updateMany({
    where: { employee_id: employee.id },
    data: { start_job_date: new Date("2010-01-01") },
  });

  const first = await createIncapacityScenario({
    employeeId: employee.id,
    totalDays: 60,
    paymentScheme: [{ days: 60, percentage: 100 }],
  });

  const nextStart = new Date(first.incapacityStart);
  nextStart.setDate(nextStart.getDate() + 30);

  await createIncapacityScenario({
    employeeId: employee.id,
    startDate: nextStart,
    totalDays: 60,
    paymentScheme: [{ days: 60, percentage: 100 }],
  });
}
