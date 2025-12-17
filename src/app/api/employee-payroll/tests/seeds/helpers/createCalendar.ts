import { prisma } from "@/lib/prisma";

export async function createCalendarDay(
  employeeId: number,
  date: string,
  {
    startHourId,
    endHourId,
    checkIn,
    checkOut,
  }: {
    startHourId: number;
    endHourId: number;
    checkIn: string;
    checkOut: string;
  },
) {
  return prisma.jobScheduleCalendar.create({
    data: {
      employee_id: employeeId,
      date: new Date(date),
      check_in: new Date(checkIn),
      check_out: new Date(checkOut),
      start_hour_id: startHourId,
      end_hour_id: endHourId,
      created_by_id: 1,
    },
  });
}
