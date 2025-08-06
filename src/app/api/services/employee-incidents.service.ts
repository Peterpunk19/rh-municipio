import { prisma } from "@/lib/prisma";
import {
  IEmployeeIncident,
  IEmployeeIncidentUpdate,
  IEmployeeIncidentFilters,
  IEmployeeIncidentGetById,
} from "@/app/api/employee-incidents/types";
import { buildWhereClause, getPaginationData } from "@/common/utils";
import { INCIDENT_STATUS_ID } from "@/common/constants/IncidentStatus";
import { ROLES, ROLES_ID_VALUES } from "@/common/constants/Roles";
import { getVacationDayValue, getActiveDaysFromSchedules } from "@/app/api/common/utils.service";
import { HolidayService } from "@/app/api/services/holiday.service";
import { EmployeeService } from "@/app/api/services/employee.service";
import { INCIDENT_TYPES_ID } from "@/common/constants/IncidentTypes";

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
      const createData: any = {
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
        created_by: {
          connect: { id: Number(employeeIncident.createdBy) },
        },
        created_at: new Date(),
      };

      if (employeeIncident.direccionId) {
        createData.direccion = {
          connect: { id: Number(employeeIncident.direccionId) },
        };
      }

      const createEmployeeIncidents = await tx.employeeIncidents.create({
        data: createData,
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
            connect: { id: Number(employeeIncident.createdBy) },
          },
          created_at: new Date(),
        },
      });

      if (employeeIncident.incidentDates && employeeIncident.incidentDates.length > 0) {
        const jobSchedules = await EmployeeService.getCurrentJobSchedule(Number(employeeIncident.employeeId));
        const daysActive = getActiveDaysFromSchedules(jobSchedules);
        const isVacationIncident = employeeIncident.incidentId === INCIDENT_TYPES_ID.VACACIONES;
        const vacationDayRecords = await Promise.all(
          employeeIncident.incidentDates.map(async (dateStr) => {
            const date = new Date(dateStr);
            let value = 1;

            if (isVacationIncident) {
              const isHoliday = await HolidayService.isHoliday(date);
              value = daysActive.has(date.getDay()) ? getVacationDayValue(date, isHoliday) : value;
            }
            return {
              date,
              value,
              employee_incident_id: createEmployeeIncidents.id,
              created_at: new Date(),
            };
          }),
        );
        if (vacationDayRecords.length > 0) {
          await tx.employeeIncidentDays.createMany({
            data: vacationDayRecords as any[],
          });
        }
      }

      return [createEmployeeIncidents, createEmployeeIncidentsStatus];
    });
  },

  async getEmployeesIncidentsByParams(employeeIncidentsFilters: IEmployeeIncidentFilters) {
    const { limit, page } = employeeIncidentsFilters;
    const offset = (Number(page) - 1) * Number(limit);

    const filterMappings = {
      employee_id: "employee_id",
      incident_id: "incident_id",
      incident_status_id: "incident_status_id",
      start_date: "start_date",
      end_date: "end_date",
    };

    const whereClause: any = await buildWhereClause(filterMappings, employeeIncidentsFilters);

    if (employeeIncidentsFilters.direccion_id) {
      whereClause.employee = {
        ...whereClause.employee,
        employee_ascriptions: {
          some: {
            direccion_id: Array.isArray(employeeIncidentsFilters.direccion_id)
              ? { in: employeeIncidentsFilters.direccion_id }
              : employeeIncidentsFilters.direccion_id,
            active: true,
          },
        },
      };
    }

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
        incident_status: true,
        start_date: true,
        end_date: true,
        created_at: true,
      },
    });

    const total = await prisma.employeeIncidents.count({ where: whereClause });
    const pagination = await getPaginationData(total, Number(limit), Number(page));

    return { ...pagination, data };
  },

  async getEmployeeIncidentById(
    id: number,
    isPDF: boolean = false,
    incidentDate?: Date,
  ): Promise<IEmployeeIncidentGetById | null> {
    const selectClause: any = {
      id: true,
      folio: true,
      oficio: true,
      description: true,
      employee_id: true,
      incident_id: true,
      incident_status_id: true,
      start_date: true,
      end_date: true,
      active: true,
      created_at: true,
      created_by_id: true,
      direccion_id: true,
      created_by: {
        select: {
          id: true,
          name: true,
          maternal_last_name: true,
          paternal_last_name: true,
        },
      },
      validated_by_id: true,
      validated_by: {
        select: {
          id: true,
          name: true,
          maternal_last_name: true,
          paternal_last_name: true,
        },
      },
      incident: {
        select: {
          id: true,
          name: true,
          display_name: true,
          display_calendar_dates: true,
        },
      },
      incident_status: {
        select: {
          id: true,
          name: true,
          display_name: true,
          btn_color: true,
          btn_display_name: true,
          btn_icon: true,
        },
      },
      employee: {
        select: {
          id: true,
          user_id: true,
          name: true,
          maternal_last_name: true,
          paternal_last_name: true,
          number_employee: true,
          rfc: true,
          curp: true,
          employee_ascriptions: {
            where: {
              active: true,
            },
            take: 1,
            select: {
              id: true,
              direccion: {
                select: {
                  id: true,
                  name: true,
                  display_name: true,
                  secretaria: {
                    select: { id: true, name: true, display_name: true },
                  },
                },
              },
            },
          },
          employee_hiring: {
            where: {
              active: true,
            },
            take: 1,
            select: {
              id: true,
              category: {
                select: { id: true, name: true, display_name: true },
              },
              employee_type: {
                select: { id: true, name: true, display_name: true },
              },
              direccion: {
                select: {
                  id: true,
                  name: true,
                  display_name: true,
                  secretaria: {
                    select: { id: true, name: true, display_name: true },
                  },
                },
              },
            },
          },
          employee_location: {
            where: {
              active: true,
            },
            take: 1,
            select: {
              id: true,
              location: {
                select: {
                  id: true,
                  name: true,
                  display_name: true,
                },
              },
            },
          },
          employee_attendance_type: {
            select: {
              id: true,
            },
          },
          job_schedule_employee: {
            where: {
              active: true,
            },
            select: {
              id: true,
              start_day: true,
              end_day: true,
              start_hour: true,
              end_hour: true,
            },
          },
        },
      },
      employee_incidents_status: {
        select: {
          id: true,
          created_at: true,
          incident_status: {
            select: {
              id: true,
              name: true,
              display_name: true,
              btn_color: true,
              btn_display_name: true,
              btn_icon: true,
            },
          },
          created_by: {
            select: {
              id: true,
              name: true,
              maternal_last_name: true,
              paternal_last_name: true,
            },
          },
        },
      },
      employee_incident_days: {
        select: {
          id: true,
          date: true,
          created_at: true,
        },
        orderBy: {
          date: "asc",
        },
      },
    };

    if (isPDF && incidentDate) {
      (selectClause as any).direccion = {
        select: {
          id: true,
          name: true,
          display_name: true,
          leaders: {
            where: {
              role_id: ROLES_ID_VALUES[ROLES.DIRECTOR],
              active: true,
              start_date: {
                lte: incidentDate,
              },
              end_date: {
                gte: incidentDate,
              },
            },
            take: 1,
            select: {
              id: true,
              employee: {
                select: {
                  id: true,
                  name: true,
                  paternal_last_name: true,
                  maternal_last_name: true,
                },
              },
              role: {
                select: {
                  name: true,
                  display_name: true,
                },
              },
              start_date: true,
              end_date: true,
            },
          },
        },
      };
    }

    return prisma.employeeIncidents.findFirst({
      where: { id },
      select: selectClause,
    }) as Promise<IEmployeeIncidentGetById | null>;
  },

  async updateEmployeeIncidents(employeeIncident: IEmployeeIncidentUpdate) {
    return prisma.$transaction(async (tx) => {
      if (employeeIncident.incidentStatusId === INCIDENT_STATUS_ID.APROBADA) {
        await Promise.all(
          employeeIncident.employeeIncidentDays.map((item: any) =>
            tx.employeeAttendance.create({
              data: {
                check_in: item.date,
                check_out: item.date,
                description: "Asistencia creada por incidencia",
                employee_ascriptions: {
                  connect: { id: employeeIncident.employeeAscriptionId },
                },
                employee_location: {
                  connect: { id: employeeIncident.employeeLocationId },
                },
                employee_attendance_type: {
                  connect: { id: 1 },
                },
                created_by: {
                  connect: { id: employeeIncident.createdById },
                },
                employee_incident: {
                  connect: { id: Number(employeeIncident.id) },
                },
              },
            }),
          ),
        );
      }

      await tx.employeeIncidents.update({
        data: {
          incident_status_id: employeeIncident.incidentStatusId,
          validated_at: employeeIncident.incidentStatusId === INCIDENT_STATUS_ID.APROBADA ? new Date() : null,
          validated_by_id: employeeIncident.validatedById || null,
        },
        where: {
          id: Number(employeeIncident.id),
        },
      });

      const createEmployeeIncidentsStatus = await tx.employeeIncidentsStatus.create({
        data: {
          employee_incident: {
            connect: { id: Number(employeeIncident.id) },
          },
          incident_status: {
            connect: { id: Number(employeeIncident.incidentStatusId) },
          },
          created_by: {
            connect: { id: Number(employeeIncident.createdById) },
          },
          created_at: new Date(),
        },
      });

      return [createEmployeeIncidentsStatus];
    });
  },
};
