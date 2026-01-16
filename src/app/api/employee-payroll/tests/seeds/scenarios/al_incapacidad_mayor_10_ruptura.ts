import { prisma } from "@/lib/prisma";
import { createEmployeeSeed } from "@/app/api/employee-payroll/tests/seeds/helpers/createEmployee";
import { createAttendance } from "@/app/api/employee-payroll/tests/seeds/helpers/createAttendance";
import { createIncapacityScenario } from "@/app/api/employee-payroll/tests/seeds/helpers/incapacityScenario.helper";
import { withTime } from "@/common/utils";

function startOfCurrentMonth(): Date {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export async function seedAL_IncapacidadRuptura(numberEmployee: string) {
  /* =========================
     1️⃣ Crear empleado base
     ========================= */
  const { employee, location, ascription, employeeAttendanceType } = await createEmployeeSeed({
    numberEmployee,
    name: "AL_Incapacidad_Ruptura",
    attendanceType: "attendance_list",
  });

  /* =========================
     2️⃣ Antigüedad > 10 años
     ========================= */
  const baseDate = startOfCurrentMonth();
  const hiringStart = new Date(baseDate);
  hiringStart.setFullYear(hiringStart.getFullYear() - 11);

  await prisma.employeeHiring.updateMany({
    where: { employee_id: employee.id },
    data: { start_job_date: hiringStart },
  });

  /* =========================
     3️⃣ Incapacidad 1 (1–15)
     ========================= */
  const first = await createIncapacityScenario({
    employeeId: employee.id,
    startDate: baseDate,
    totalDays: 15,
    paymentScheme: [{ days: 15, percentage: 100 }],
  });

  /* =========================
     4️⃣ Día trabajado (rompe continuidad)
     ========================= */
  const workDay = new Date(baseDate);
  workDay.setDate(workDay.getDate() + 15); // día 16

  const checkIn = withTime(workDay, 8, 0);
  const checkOut = withTime(workDay, 16, 0);

  await createAttendance(employee.id, location.id, ascription.id, employeeAttendanceType.id, {
    checkIn: checkIn.toString(),
    checkOut: checkOut.toString(),
  });

  /* =========================
     5️⃣ Incapacidad 2 (reinicia)
     ========================= */
  const secondStart = new Date(workDay);
  secondStart.setDate(secondStart.getDate() + 1); // día 17

  await createIncapacityScenario({
    employeeId: employee.id,
    startDate: secondStart,
    totalDays: 14,
    paymentScheme: [{ days: 14, percentage: 100 }],
  });
}
