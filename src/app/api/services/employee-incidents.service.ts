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
import { resolveIncapacityContinuation } from "@/app/api/services/helpers/employeeIncidentsHelper";

async function resolveSchedule({ employeeId, date, attendanceTypeId, tx }) {
  const attendanceType = await tx.employeeAttendanceType.findUnique({
    where: { id: attendanceTypeId },
  });

  if (!attendanceType) return {};

  const jsDay = date.getDay() === 0 ? 7 : date.getDay(); // 0=sunday → 7

  if (attendanceType.name === "intercalated") {
    const calendar = await tx.jobScheduleCalendar.findFirst({
      where: {
        employee_id: employeeId,
        date: {
          gte: new Date(date.setHours(0, 0, 0, 0)),
          lte: new Date(date.setHours(23, 59, 59, 999)),
        },
        active: true,
      },
    });

    if (calendar) {
      return {
        job_schedule_calendar: {
          connect: { id: calendar.id },
        },
      };
    }
    return {};
  }

  const weeklySchedule = await tx.jobScheduleEmployee.findFirst({
    where: {
      employee_id: employeeId,
      active: true,
      start_day_id: { lte: jsDay },
      end_day_id: { gte: jsDay },
    },
  });

  if (weeklySchedule) {
    return {
      job_schedule_employee: {
        connect: { id: weeklySchedule.id },
      },
    };
  }

  return {};
}

export const EmployeeIncidentsService = {
  async getFolio() {
    const lastNumeric = await prisma.employeeIncidents.findFirst({
      where: {
        AND: [{ folio: { not: { contains: "-" } } }, { folio: { not: { contains: "INC" } } }],
      },
      orderBy: { folio: "desc" },
      select: { folio: true },
    });

    if (!lastNumeric) {
      return "000001";
    }

    const lastNumber = parseInt(lastNumeric.folio, 10);
    return String(lastNumber + 1).padStart(6, "0");
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
      const employeeId = Number(employeeIncident.employeeId);

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
          connect: { id: employeeId },
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

      if (!employeeIncident.incidentDates?.length) {
        return createEmployeeIncidents;
      }

      const isVacationIncident = employeeIncident.incidentId === INCIDENT_TYPES_ID.VACACIONES;
      const isEconomicLeave = employeeIncident.incidentId === INCIDENT_TYPES_ID.PERMISO_ECONOMICO;
      const isMedicalLeave = employeeIncident.incidentId === INCIDENT_TYPES_ID.LICENCIA_MEDICA;
      const isIncapacity = employeeIncident.incidentId === INCIDENT_TYPES_ID.INCAPACIDAD;

      const incidentDates = employeeIncident.incidentDates
        .map((d) => new Date(d))
        .sort((a, b) => a.getTime() - b.getTime());

      const jobSchedules = await EmployeeService.getCurrentJobSchedule(employeeId);
      const daysActive = getActiveDaysFromSchedules(jobSchedules);

      let previousDays = 0;
      let fullSalaryDays = 0;
      let halfSalaryDays = 0;

      if (isIncapacity) {
        previousDays = await resolveIncapacityContinuation({
          tx,
          employeeId,
          startDate: incidentDates[0],
        });

        const employee = await EmployeeService.getEmployeeWithHiring(employeeId, incidentDates[0]);

        const rule = await tx.incapacityRule.findFirst({
          where: {
            active: true,
            min_years: { lte: employee.antiguedadYears },
            OR: [{ max_years: null }, { max_years: { gte: employee.antiguedadYears } }],
          },
          orderBy: { min_years: "desc" },
        });

        if (!rule) throw new Error("No incapacity rule configured");

        fullSalaryDays = rule.full_salary_days;
        halfSalaryDays = rule.half_salary_days;
      }

      const records: any[] = [];
      let dayCounter = previousDays;

      for (const date of incidentDates) {
        let value = 1;
        let percentage_salary = 100;

        if (isVacationIncident || isEconomicLeave) {
          const isHoliday = await HolidayService.isHoliday(date);
          value = daysActive.has(date.getDay()) ? getVacationDayValue(date, isHoliday) : value;
        }

        if (isIncapacity) {
          dayCounter++;

          if (dayCounter <= fullSalaryDays) percentage_salary = 100;
          else if (dayCounter <= fullSalaryDays + halfSalaryDays) percentage_salary = 50;
          else percentage_salary = 0;
        }

        if (isMedicalLeave && employeeIncident.incidentDatesWithPercentage) {
          const found = employeeIncident.incidentDatesWithPercentage.find(
            (d) => new Date(d.date).getTime() === date.getTime(),
          );
          percentage_salary = found?.percentage ?? 100;
        }

        records.push({
          date,
          value,
          percentage_salary,
          employee_incident_id: createEmployeeIncidents.id,
          created_at: new Date(),
        });
      }

      await tx.employeeIncidentDays.createMany({ data: records });

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
            employee_ascriptions: {
              where: {
                active: true,
              },
              select: {
                id: true,
                start_date: true,
                end_date: true,
                direccion: {
                  select: {
                    id: true,
                    name: true,
                    display_name: true,
                    secretaria: {
                      select: {
                        id: true,
                        name: true,
                        display_name: true,
                      },
                    },
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
          percentage_salary: true,
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
              OR: [
                {
                  role_id: ROLES_ID_VALUES[ROLES.RESPONSABLE_INMEDIATO],
                  active: true,
                },
                {
                  role_id: {
                    in: [
                      ROLES_ID_VALUES[ROLES.DIRECTOR],
                      ROLES_ID_VALUES[ROLES.SECRETARIO],
                      ROLES_ID_VALUES[ROLES.COORDINADOR],
                    ],
                  },
                  active: true,
                  start_date: { lte: incidentDate },
                  end_date: { gte: incidentDate },
                },
              ],
            },
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
              role_id: true,
              start_date: true,
              end_date: true,
              sign_incidents: true,
              sign_requests: true,
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
          employeeIncident.employeeIncidentDays.map(async (item: any) => {
            const startOfDay = new Date(item.date);
            const endOfDay = new Date(startOfDay);
            endOfDay.setHours(23, 59, 59, 999);

            const existingAttendance = await tx.employeeAttendance.findFirst({
              where: {
                employee_ascriptions: {
                  employee: { number_employee: employeeIncident.numberEmployee },
                },
                active: true,
                OR: [
                  {
                    check_in: {
                      gte: startOfDay,
                      lte: endOfDay,
                    },
                  },
                  {
                    check_out: {
                      gte: startOfDay,
                      lte: endOfDay,
                    },
                  },
                ],
              },
            });

            if (existingAttendance) {
              const existingRelation = await tx.employeeAttendanceIncident.findFirst({
                where: {
                  employee_attendance_id: existingAttendance.id,
                  employee_incident_id: employeeIncident.id,
                },
              });

              if (!existingRelation) {
                await tx.employeeAttendanceIncident.create({
                  data: {
                    employee_attendance: {
                      connect: { id: Number(existingAttendance.id) },
                    },
                    employee_incident: {
                      connect: { id: Number(employeeIncident.id) },
                    },
                    created_at: new Date(),
                  },
                });
              }
            } else {
              const scheduleData = await resolveSchedule({
                employeeId: employeeIncident.employeeId,
                date: startOfDay,
                attendanceTypeId: employeeIncident.employeeAttendanceTypeId,
                tx,
              });

              const employeeAttendance = await tx.employeeAttendance.create({
                data: {
                  check_in: startOfDay,
                  check_out: endOfDay,
                  description: "Asistencia creada por incidencia",
                  employee: {
                    connect: { id: employeeIncident.employeeId },
                  },
                  employee_ascriptions: {
                    connect: { id: employeeIncident.employeeAscriptionId },
                  },
                  employee_location: {
                    connect: { id: employeeIncident.employeeLocationId },
                  },
                  employee_attendance_type: {
                    connect: { id: employeeIncident.employeeAttendanceTypeId },
                  },
                  created_by: {
                    connect: { id: employeeIncident.createdById },
                  },
                  ...scheduleData,
                },
              });

              await tx.employeeAttendanceIncident.create({
                data: {
                  employee_attendance: {
                    connect: { id: Number(employeeAttendance.id) },
                  },
                  employee_incident: {
                    connect: { id: Number(employeeIncident.id) },
                  },
                  created_at: new Date(),
                },
              });
            }
          }),
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

  async findDateConflicts(employeeId: number, incidentDates: (string | Date)[], incidentId: number) {
    if (!incidentDates || incidentDates.length === 0) return [] as Date[];
    const dayWindows = incidentDates.map((d) => {
      const date = d instanceof Date ? d : new Date(String(d).trim());
      const start = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0));
      const next = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1, 0, 0, 0, 0));
      return { start, next };
    });

    const BATCH_SIZE = 50;
    let allConflicts: { date: Date }[] = [];

    for (let i = 0; i < dayWindows.length; i += BATCH_SIZE) {
      const batchWindows = dayWindows.slice(i, i + BATCH_SIZE);

      const batchConflicts = await prisma.employeeIncidentDays.findMany({
        where: {
          OR: batchWindows.map(({ start, next }) => ({
            date: { gte: start, lt: next },
            employee_incident: {
              employee_id: Number(employeeId),
              incident_id: incidentId,
              incident_status_id: { in: [INCIDENT_STATUS_ID.CREADA, INCIDENT_STATUS_ID.APROBADA] },
            },
          })),
        },
        select: { date: true },
      });

      allConflicts = [...allConflicts, ...batchConflicts];
    }

    return allConflicts.map((c) => c.date);
  },

  async hasOpenIncapacity(employeeId: number) {
    const openIncapacity = await prisma.employeeIncidents.findFirst({
      where: {
        employee_id: employeeId,
        incident_id: INCIDENT_TYPES_ID.INCAPACIDAD,
        incident_status_id: {
          in: [INCIDENT_STATUS_ID.CREADA],
        },
      },
    });

    return Boolean(openIncapacity);
  },
};
