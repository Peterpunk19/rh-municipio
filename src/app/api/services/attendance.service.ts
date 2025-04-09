import { prisma } from "@/lib/prisma";

export const AttendanceService = {
  async getAttendanceById(id: number) {
    return prisma.attendance.findFirst({
      where: {
        id,
      },
    });
  },
};
