import { prisma } from "@/lib/prisma";
import type { IEmployeeAttendanceType } from "@/app/api/employees/interface";

export const EmployeeAttendanceTypeService = {
  async createEmployeeAttendanceType(employeeAttendanceType: IEmployeeAttendanceType) {
    return prisma.$transaction(async (tx) => {
      const createdEmployeeAttendanceType = await tx.employeeAttendanceType.create({
        data: {
          employee_id: employeeAttendanceType.employeeId,
          attendance_id: employeeAttendanceType.attendanceId,
          active: employeeAttendanceType.active,
          created_at: new Date(),
        },
        include: {
          attendance: true,
        },
      });

      return [createdEmployeeAttendanceType];
    });
  },
};
