import { prisma } from "@/lib/prisma";
import { IEmployeeLocation } from "@/app/api/employees/interface";

export const EmployeeLocationService = {
  async createEmployeeLocation(employeeLocation: IEmployeeLocation) {
    return prisma.$transaction(async (tx) => {
      const createdEmployeeLocation = await tx.employeeLocation.create({
        data: {
          employee_id: employeeLocation.employeeId,
          location_id: employeeLocation.locationId,
          attendance_id: employeeLocation.attendanceId,
          active: employeeLocation.active,
          created_at: new Date(),
        },
        include: {
          location: true,
          attendance: true,
        },
      });

      return [createdEmployeeLocation];
    });
  },
};
