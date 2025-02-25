import { prisma } from "@/lib/prisma";
import type { IEmployeeIncident, IEmployeeIncidentFilters } from "@/app/api/employee-incidents/types";
import { buildWhereClause, getPaginationData } from "@/common/utils";

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

  async getEmployeesIncidentsByParams(employeeIncidentsFilters: IEmployeeIncidentFilters) {
    const { limit, page } = employeeIncidentsFilters;
    const offset = (Number(page) - 1) * Number(limit);

    const filterMappings = {
      incident_id: "incident_id",
      incident_status_id: "incident_status_id",
      start_date: "start_date",
      end_date: "end_date",
    };

    const whereClause: any = await buildWhereClause(filterMappings, employeeIncidentsFilters);

    if (employeeIncidentsFilters.search) {
      whereClause.OR = [
        { oficio: { contains: employeeIncidentsFilters.search } },
        { folio: { contains: employeeIncidentsFilters.search } },
        {
          employee: {
            OR: [
              { name: { contains: employeeIncidentsFilters.search } },
              { paternal_last_name: { contains: employeeIncidentsFilters.search } },
              { maternal_last_name: { contains: employeeIncidentsFilters.search } },
              { rfc: { contains: employeeIncidentsFilters.search } },
              { curp: { contains: employeeIncidentsFilters.search } },
              { number_employee: { contains: employeeIncidentsFilters.search } },
            ],
          },
        },
      ];
    }

    const data = await prisma.employeeIncidents.findMany({
      where: whereClause,
      skip: offset,
      take: Number(limit),
      orderBy: {
        id: "desc",
      },
      select: {
        id: true,
        folio: true,
        oficio: true,
        employee_id: true,
        employee: {
          select: {
            id: true,
            name: true,
            paternal_last_name: true,
            maternal_last_name: true,
            number_employee: true,
            birthday: true,
            rfc: true,
            curp: true,
            employee_hiring_id: true,
            employee_hiring: {
              where: {
                active: true,
              },
              take: 1,
              select: {
                id: true,
                category: true,
                active: true,
                start_job_date: true,
                end_job_date: true,
                employee_type_id: true,
                direccion: {
                  select: {
                    id: true,
                    display_name: true,
                    secretaria: true,
                    secretaria_id: true,
                  },
                },
              },
            },
          },
        },
        incident_id: true,
        incident: true,
        incident_status_id: true,
        start_date: true,
        end_date: true,
        created_at: true,
      },
    });

    const total = await prisma.employeeIncidents.count({ where: whereClause });
    const pagination = await getPaginationData(total, Number(limit), Number(page));

    return { ...pagination, data };
  },
};
