import { prisma } from "@/lib/prisma";

export async function createWeeklySchedule(
  employeeId: number,
  { startDay = 1, endDay = 5, startHourId = 17, endHourId = 30 },
) {
  return prisma.jobScheduleEmployee.create({
    data: {
      employee_id: employeeId,
      name: "Jornada Test",
      description: "Seed Jornada",
      start_day_id: startDay,
      end_day_id: endDay,
      start_hour_id: startHourId,
      end_hour_id: endHourId,
    },
  });
}
