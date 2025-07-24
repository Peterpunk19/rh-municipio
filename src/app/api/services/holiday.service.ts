import { prisma } from "@/lib/prisma";

export const HolidayService = {
  async isHoliday(date: Date): Promise<boolean> {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    const holiday = await prisma.holiday.findFirst({
      where: {
        validation_date: {
          gte: start,
          lte: end,
        },
        active: true,
      },
    });
    return !!holiday;
  },
};
