import { prisma } from "@/lib/prisma";

export const EmployeeIncidentsStatusService = {
  async validateEmployeeIncidentStatus(employeeIncidentId: number, incidentStatusId: number) {
    return await prisma.employeeIncidentsStatus.findFirst({
      where: {
        employee_incident_id: employeeIncidentId,
        incident_status_id: incidentStatusId,
      },
    });
  },
};
