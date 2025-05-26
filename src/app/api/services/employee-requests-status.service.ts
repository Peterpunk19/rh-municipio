import { prisma } from "@/lib/prisma";

export const EmployeeRequestsStatusService = {
  async validateEmployeeRequestStatus(employeeRequestId: number, requestStatusId: number) {
    return await prisma.employeeRequestStatus.findFirst({
      where: {
        employee_request_id: employeeRequestId,
        request_status_id: requestStatusId,
      },
    });
  },
};
