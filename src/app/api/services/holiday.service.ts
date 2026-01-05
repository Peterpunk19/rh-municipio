import { prisma } from "@/lib/prisma";
import { IHolidayCreate } from "@/interfaces/Catalogs";
import { HttpMessages } from "@/common/response/messages";
import { formatDate } from "@/utils/formatter";

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
  async createHoliday(data: IHolidayCreate) {
    const validationDate = new Date(data.validation_date);
    const year = validationDate.getFullYear();

    const holidayDate = new Date(data.holiday_date);

    const nameWithYear = `${data.name}_${year}`;

    const existingByName = await prisma.holiday.findFirst({
      where: { name: nameWithYear },
    });

    if (existingByName) {
      throw new Error(`${HttpMessages.holiday.alreadyExists} (${year})`);
    }

    const existingByDate = await prisma.holiday.findFirst({
      where: { holiday_date: holidayDate },
    });

    const existingValidationDate = await prisma.holiday.findFirst({
      where: { validation_date: validationDate },
    });

    if (existingByDate) {
      throw new Error(`Ya existe un día festivo con la fecha ${formatDate(holidayDate)}`);
    }

    if (existingValidationDate) {
      throw new Error(`Ya existe un día de validación con la fecha ${formatDate(validationDate)}`);
    }

    return prisma.holiday.create({
      data: {
        name: nameWithYear,
        display_name: data.display_name,
        holiday_date: holidayDate,
        validation_date: validationDate,
        active: data.active,
      },
    });
  },
};
