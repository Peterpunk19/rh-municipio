import { prisma } from "@/lib/prisma";
import { IEmployeeAttendance } from "@/app/api/employee-attendance/types";

export const EmployeeAttendanceService = {
  async validateEmployeeAttendance(employeeAttendance: IEmployeeAttendance) {
    return await prisma.employeeAttendance.findFirst({
      where: {
        employee_hiring_id: employeeAttendance.employeeHiringId,
        check_in: employeeAttendance.checkIn,
        check_out: employeeAttendance.checkOut,
      },
    });
  },

  async createEmployeeAttendance(employeeAttendance: IEmployeeAttendance) {
    return prisma.$transaction(async (tx) => {
      const createEmployeeAttendance = await tx.employeeAttendance.create({
        data: {
          check_in: employeeAttendance.checkIn,
          check_out: employeeAttendance.checkOut,
          employee_hiring: {
            connect: { id: employeeAttendance.employeeHiringId },
          },
          employee_location: {
            connect: { id: employeeAttendance.employeeLocationId },
          },
          created_by: {
            connect: { id: employeeAttendance.createdById },
          },
        },
      });

      return [createEmployeeAttendance];
    });
  },
};
