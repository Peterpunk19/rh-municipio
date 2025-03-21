import { prisma } from "@/lib/prisma";
import { IEmployeeAttendance, IEmployeeAttendanceFilters } from "@/app/api/employee-attendance/types";
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

  async createEmployeeAttendance(employeeAttendance: IEmployeeAttendance) {
    return prisma.$transaction(async (tx) => {
      const createEmployeeAttendance = await tx.employeeAttendance.create({
        data: {
          check_in: employeeAttendance.checkIn,
          check_out: employeeAttendance.checkOut,
          active: employeeAttendance.active,
          description: employeeAttendance.description,
          employee_hiring: {
            connect: { id: employeeAttendance.employeeHiringId },
          },
          employee_location: {
            connect: { id: employeeAttendance.employeeLocationId },
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

  async getEmployeesAttendanceByParams(employeeAttendanceFilters: IEmployeeAttendanceFilters) {
    const limit = Number(employeeAttendanceFilters.limit);
    const page = Number(employeeAttendanceFilters.page);
    const offset = (page - 1) * limit;

    const filterMappings = {
      organismPublic: {
        path: "employee_hiring.direccion.secretaria_id",
      },
      organismAdministrative: {
        path: "employee_hiring.direccion_id",
      },
    };

    const searchMappings = [
      { path: ["employee_hiring", "employee", "name"], operators: ["is", "is", "contains"] },
      { path: ["employee_hiring", "employee", "paternal_last_name"], operators: ["is", "is", "contains"] },
      { path: ["employee_hiring", "employee", "maternal_last_name"], operators: ["is", "is", "contains"] },
      { path: ["employee_hiring", "employee", "rfc"], operators: ["is", "is", "contains"] },
      { path: ["employee_hiring", "employee", "curp"], operators: ["is", "is", "contains"] },
      { path: ["employee_hiring", "employee", "number_employee"], operators: ["is", "is", "contains"] },
    ];

    const whereClause: any = await buildWhereClause(filterMappings, employeeAttendanceFilters, searchMappings);

    if (employeeAttendanceFilters.checkIn) {
      whereClause.check_in = {
        gte: new Date(employeeAttendanceFilters.checkIn),
      };
    }

    if (employeeAttendanceFilters.checkOut) {
      whereClause.check_out = {
        lte: new Date(employeeAttendanceFilters.checkOut),
      };
    }

    const data = await prisma.employeeAttendance.findMany({
      where: whereClause,
      skip: offset,
      take: limit,
      orderBy: {
        id: "desc",
      },
      include: {
        employee_location: {
          select: {
            location_id: true,
            active: true,
            attendance: {
              select: {
                id: true,
                display_name: true,
              },
            },
            location: {
              select: {
                id: true,
                name: true,
                display_name: true,
              },
            },
          },
        },
        employee_hiring: {
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

    const attendances = data.map((item: any) => ({
      id: item.id,
      check_in: item.check_in,
      check_out: item.check_out,
      active: item.active,
      location: {
        id: item.employee_location.location_id,
        active: item.employee_location.active,
        name: item.employee_location.location.name,
        display_name: item.employee_location.location.display_name,
      },
      type_attendance: item.employee_location.attendance,
      employee: {
        id: item.employee_hiring.employee.id,
        number_employee: item.employee_hiring.employee.number_employee,
        name: item.employee_hiring.employee.name,
        paternal_last_name: item.employee_hiring.employee.paternal_last_name,
        maternal_last_name: item.employee_hiring.employee.maternal_last_name,
        fullName: `${item.employee_hiring.employee.name} ${item.employee_hiring.employee.paternal_last_name} ${item.employee_hiring.employee.maternal_last_name}`,
        rfc: item.employee_hiring.employee.rfc,
        curp: item.employee_hiring.employee.curp,
      },
      organism_public: item.employee_hiring.direccion.secretaria,
      organism_administrative: {
        id: item.employee_hiring.direccion.id,
        name: item.employee_hiring.direccion.name,
        display_name: item.employee_hiring.direccion.display_name,
      },
      created_by: {
        id: item.created_by.id,
        username: item.created_by.username,
      },
    }));

    const total = await prisma.employeeAttendance.count({ where: whereClause });
    const pagination = await getPaginationData(total, limit, page);

    return { ...pagination, attendances };
  },
};
