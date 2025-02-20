import { prisma } from "@/lib/prisma";
import type { IEmployeeIncident } from "@/app/api/employee-incidents/types";

export const EmployeeIncidentsService = {
  async getFolio() {
    const lastFolio = await prisma.employeeIncidents.findFirst({
      orderBy: {
        folio: "desc",
      },
      select: {
        folio: true,
      },
    });

    if (!lastFolio) {
      return "000001";
    }

    const lastNumber = Number.parseInt(lastFolio.folio, 10);
    return (lastNumber + 1).toString().padStart(6, "0");
  },

  async validateEmployeeIncident(params: IEmployeeIncident) {
    return await prisma.employeeIncidents.findFirst({
      where: {
        employee_id: Number(params.employeeId),
        start_date: params.startDate,
        end_date: params.endDate,
        incident_status_id: params.incidentStatusId,
        incident_id: Number(params.incidentId),
      },
    });
  },

  async createEmployeeIncidents(employeeIncident: IEmployeeIncident) {
    return prisma.$transaction(async (tx) => {
      const createEmployeeIncidents = await tx.employeeIncidents.create({
        data: {
          folio: employeeIncident.folio,
          oficio: employeeIncident.oficio ?? "",
          start_date: employeeIncident.startDate,
          end_date: employeeIncident.endDate,
          description: employeeIncident.description,
          incident: {
            connect: { id: Number(employeeIncident.incidentId) },
          },
          incident_status: {
            connect: { id: Number(employeeIncident.incidentStatusId) },
          },
          employee: {
            connect: { id: Number(employeeIncident.employeeId) },
          },
          created_at: new Date(),
        },
      });

      const createEmployeeIncidentsStatus = await tx.employeeIncidentsStatus.create({
        data: {
          employee_incident: {
            connect: { id: Number(createEmployeeIncidents.id) },
          },
          incident_status: {
            connect: { id: Number(employeeIncident.incidentStatusId) },
          },
          created_by: {
            connect: { id: 1 },
          },
          created_at: new Date(),
        },
      });

      return [createEmployeeIncidents, createEmployeeIncidentsStatus];
    });
  },
};
