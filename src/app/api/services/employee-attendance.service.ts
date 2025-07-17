import { prisma } from "@/lib/prisma";
import type { IEmployeeAttendance, IEmployeeAttendanceFilters } from "@/app/api/employee-attendance/types";
import { buildWhereClause, getPaginationData } from "@/common/utils";

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

  async updateAttendanceById(
    numberEmployee: string,
    direccionId: number,
    employeeLocationId: number,
    dateTime: string,
  ) {
    const [datePart] = dateTime.split(" ");
    const startOfDay = new Date(`${datePart}T00:00:00`);
    const endOfDay = new Date(`${datePart}T23:59:59`);

    const existing = await prisma.employeeAttendance.findFirst({
      where: {
        employee_ascription_id: direccionId,
        employee_location_id: employeeLocationId,
        check_out: null,
        check_in: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: { check_in: "asc" },
    });

    if (existing) {
      return await prisma.employeeAttendance.update({
        where: { id: existing.id },
        data: {
          check_out: new Date(dateTime),
          udpated_at: new Date(),
        },
      });
    } else {
      throw new Error(`No se encontró entrada para empleado ${numberEmployee} en ${dateTime}`);
    }
  },

  async createEmployeeAttendance(employeeAttendance: IEmployeeAttendance) {
    return prisma.$transaction(async (tx) => {
      const createEmployeeAttendance = await tx.employeeAttendance.create({
        data: {
          check_in: employeeAttendance.checkIn,
          check_out: employeeAttendance.checkOut,
          active: employeeAttendance.active,
          description: employeeAttendance.description,
          employee_ascriptions: {
            connect: { id: employeeAttendance.employeeAscriptionId },
          },
          employee_location: {
            connect: { id: employeeAttendance.employeeLocationId },
          },
          employee_attendance_type: {
            connect: { id: employeeAttendance.employeeAttendanceTypeId },
          },
          created_by: {
            connect: { id: employeeAttendance.createdById },
          },
          created_at: new Date(),
        },
      });

      return [createEmployeeAttendance];
    });
  },

  async createEmployeeAttendanceByBulk(attendancesToCreate: any) {
    return await prisma.employeeAttendance.createMany({
      data: attendancesToCreate,
      skipDuplicates: true,
    });
  },

  async getEmployeesAttendanceByParams(employeeAttendanceFilters: IEmployeeAttendanceFilters) {
    const limit = Number(employeeAttendanceFilters.limit);
    const page = Number(employeeAttendanceFilters.page);
    const offset = (page - 1) * limit;

    const filterMappings = {
      employeeId: {
        path: "employee_ascriptions.employee.id",
      },
      typeAttendance: {
        path: "employee_attendance_type.attendance_id",
      },
      location: {
        path: "employee_location.location_id",
      },
      organismPublic: {
        path: "employee_ascriptions.direccion.secretaria_id",
      },
      organismAdministrative: {
        path: "employee_ascriptions.direccion_id",
      },
    };

    const searchMappings = [
      { path: ["employee_ascriptions", "employee", "name"], operators: ["is", "is", "contains"] },
      { path: ["employee_ascriptions", "employee", "paternal_last_name"], operators: ["is", "is", "contains"] },
      { path: ["employee_ascriptions", "employee", "maternal_last_name"], operators: ["is", "is", "contains"] },
      { path: ["employee_ascriptions", "employee", "rfc"], operators: ["is", "is", "contains"] },
      { path: ["employee_ascriptions", "employee", "curp"], operators: ["is", "is", "contains"] },
      { path: ["employee_ascriptions", "employee", "number_employee"], operators: ["is", "is", "contains"] },
    ];

    const whereClause: any = await buildWhereClause(filterMappings, employeeAttendanceFilters, searchMappings);

    if (employeeAttendanceFilters.checkIn || employeeAttendanceFilters.checkOut) {
      whereClause.AND = [];

      if (employeeAttendanceFilters.checkIn) {
        whereClause.AND.push({
          check_in: {
            gte: new Date(employeeAttendanceFilters.checkIn),
          },
        });
      }

      if (employeeAttendanceFilters.checkOut) {
        whereClause.AND.push({
          check_in: {
            lte: new Date(employeeAttendanceFilters.checkOut),
          },
        });
      }
    }

    const attendances = await prisma.employeeAttendance.findMany({
      where: whereClause,
      skip: offset,
      take: limit,
      orderBy: {
        id: "desc",
      },
      select: {
        id: true,
        check_in: true,
        check_out: true,
        active: true,
        created_by_id: true,
        employee_ascription_id: true,
        description: true,
        employee_attendance_type_id: true,
        employee_attendance_type: {
          select: {
            attendance_id: true,
            active: true,
            attendance: {
              select: {
                id: true,
                name: true,
                display_name: true,
              },
            },
          },
        },
        employee_incident_id: true,
        employee_incident: {
          select: {
            id: true,
            active: true,
            incident: {
              select: {
                id: true,
                name: true,
                display_name: true,
                display_time_on_calendar: true,
              },
            },
          },
        },
        employee_location_id: true,
        employee_location: {
          select: {
            location_id: true,
            active: true,
            location: {
              select: {
                id: true,
                name: true,
                display_name: true,
              },
            },
          },
        },
        employee_ascriptions: {
          select: {
            id: true,
            employee: {
              select: {
                id: true,
                number_employee: true,
                name: true,
                paternal_last_name: true,
                maternal_last_name: true,
                rfc: true,
                curp: true,
              },
            },
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
        created_by: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    console.log("attendances");
    console.log(attendances);

    const data = attendances.map((item: any) => ({
      id: item.id,
      employee_incident: item.employee_incident,
      check_in: item.check_in,
      check_out: item.check_out,
      created_at: item.created_at,
      active: item.active,
      description: item.description,
      location: {
        id: item.employee_location.location_id,
        active: item.employee_location.active,
        name: item.employee_location.location.name,
        display_name: item.employee_location.location.display_name,
      },
      type_attendance: item.employee_attendance_type.attendance,
      employee: {
        id: item.employee_ascriptions.employee.id,
        number_employee: item.employee_ascriptions.employee.number_employee,
        name: item.employee_ascriptions.employee.name,
        paternal_last_name: item.employee_ascriptions.employee.paternal_last_name,
        maternal_last_name: item.employee_ascriptions.employee.maternal_last_name,
        fullName: `${item.employee_ascriptions.employee.name} ${item.employee_ascriptions.employee.paternal_last_name} ${item.employee_ascriptions.employee.maternal_last_name}`,
        rfc: item.employee_ascriptions.employee.rfc,
        curp: item.employee_ascriptions.employee.curp,
      },
      organism_public: item.employee_ascriptions.direccion.secretaria,
      organism_administrative: {
        id: item.employee_ascriptions.direccion.id,
        name: item.employee_ascriptions.direccion.name,
        display_name: item.employee_ascriptions.direccion.display_name,
      },
      created_by: {
        id: item.created_by.id,
        username: item.created_by.username,
      },
    }));

    const total = await prisma.employeeAttendance.count({ where: whereClause });
    const pagination = await getPaginationData(total, limit, page);

    return { ...pagination, data };
  },

  async getEmployeeAttendanceById(id: number) {
    const employeeAttendance = await prisma.employeeAttendance.findUnique({
      where: { id: id },
      include: {
        employee_location: {
          select: {
            location_id: true,
            active: true,
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
            attendance_id: true,
            active: true,
            attendance: {
              select: {
                id: true,
                name: true,
                display_name: true,
              },
            },
          },
        },
        employee_ascriptions: {
          select: {
            employee: {
              select: {
                id: true,
                number_employee: true,
                name: true,
                paternal_last_name: true,
                maternal_last_name: true,
                rfc: true,
                curp: true,
                employee_hiring: {
                  select: {
                    category: {
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
        created_by: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    if (!employeeAttendance) return null;
    return {
      id: employeeAttendance.id,
      check_in: employeeAttendance.check_in,
      check_out: employeeAttendance.check_out,
      active: employeeAttendance.active,
      description: employeeAttendance.description,
      created_at: employeeAttendance.created_at,
      location: {
        id: employeeAttendance.employee_location.location_id,
        active: employeeAttendance.employee_location.active,
        name: employeeAttendance.employee_location.location?.name,
        display_name: employeeAttendance.employee_location.location?.display_name,
      },
      type_attendance: employeeAttendance.employee_attendance_type.attendance,
      employee: {
        id: employeeAttendance.employee_ascriptions.employee?.id,
        number_employee: employeeAttendance.employee_ascriptions.employee?.number_employee,
        name: employeeAttendance.employee_ascriptions.employee?.name,
        paternal_last_name: employeeAttendance.employee_ascriptions.employee?.paternal_last_name,
        maternal_last_name: employeeAttendance.employee_ascriptions.employee?.maternal_last_name,
        fullName: `${employeeAttendance.employee_ascriptions.employee?.name} ${employeeAttendance.employee_ascriptions.employee?.paternal_last_name} ${employeeAttendance.employee_ascriptions.employee?.maternal_last_name}`,
        rfc: employeeAttendance.employee_ascriptions.employee?.rfc,
        curp: employeeAttendance.employee_ascriptions.employee?.curp,
        category: {
          id: employeeAttendance.employee_ascriptions.employee.employee_hiring.category?.id,
          name: employeeAttendance.employee_ascriptions.employee.employee_hiring.category?.display_name,
        },
      },
      organism_public: {
        id: employeeAttendance.employee_ascriptions.direccion.secretaria.id,
        name: employeeAttendance.employee_ascriptions.direccion.secretaria.name,
        display_name: employeeAttendance.employee_ascriptions.direccion.secretaria.display_name,
      },
      organism_administrative: {
        id: employeeAttendance.employee_ascriptions.direccion.id,
        name: employeeAttendance.employee_ascriptions.direccion.name,
        display_name: employeeAttendance.employee_ascriptions.direccion.display_name,
      },
      created_by: {
        id: employeeAttendance.created_by.id,
        username: employeeAttendance.created_by.username,
      },
    };
  },
};
