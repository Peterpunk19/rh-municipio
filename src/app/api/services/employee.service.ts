import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { encryptPassword, startOfDay, endOfDay } from "@/common/utils";
import type { IEmployee, IEmployeeFilters } from "@/app/api/employees/interface";

export const EmployeeService = {
  async getEmployeeByRfcCurp(rfc: string, curp: string) {
    return prisma.employee.findFirst({
      where: {
        OR: [{ rfc }, { curp }],
      },
    });
  },

  async getNumberEmployee() {
    const lastEmployee = await prisma.employee.findFirst({
      orderBy: {
        number_employee: "desc",
      },
      select: {
        number_employee: true,
      },
    });

    if (!lastEmployee) {
      return "000001";
    }

    const lastNumber = Number.parseInt(lastEmployee.number_employee, 10);
    return (lastNumber + 1).toString().padStart(6, "0");
  },

  async getEmployeeById(id: number) {
    return prisma.employee.findFirst({
      include: {
        employee_hiring: {
          include: {
            category: true,
            employee_type: true,
            direccion: {
              include: {
                secretaria: true,
              },
            },
          },
        },
        employee_location: {
          include: {
            location: true,
          },
        },
        gender: true,
        status_employee: true,
        profession: true,
        occupation: true,
        marital_status: true,
        schooling: true,
        employee_trade_union: {
          include: {
            trade_union: true,
          },
        },
        employee_address: {
          include: {
            municipality: {
              include: {
                state: true,
              },
            },
          },
        },
      },
      where: {
        id,
      },
    });
  },

  async createEmployee(employee: IEmployee) {
    return prisma.$transaction(async (tx) => {
      const createUser = await tx.user.create({
        data: {
          uuid: uuidv4(),
          username: employee.rfc,
          password: await encryptPassword(employee.numberEmployee),
          role: {
            connect: { name: "empleado" },
          },
        },
      });

      const createEmployee = await tx.employee.create({
        data: {
          number_employee: employee.numberEmployee,
          name: employee.name,
          paternal_last_name: employee.paternalLastName,
          maternal_last_name: employee.maternalLastName,
          birthday: employee.birthday,
          rfc: employee.rfc,
          curp: employee.curp,
          status_employee: {
            connect: { name: "alta" },
          },
          gender: {
            connect: { id: employee.genderId },
          },
          user: {
            connect: {
              id: createUser.id,
            },
          },
        },
      });

      const createEmployeeAddress = await tx.employeeAddress.create({
        data: {
          employee_id: createEmployee.id,
          address_line_1: employee.addressLine1,
          address_line_2: employee.addressLine2,
          address_line_3: employee.addressLine3,
          address_line_4: employee.addressLine4,
          postal_code: employee.postalCode,
          postal_code_sat: employee.postalCodeSat,
          municipality_id: employee.municipalityId,
          created_at: new Date(),
        },
      });

      const createEmployeeHiring = await tx.employeeHiring.create({
        data: {
          employee_id: createEmployee.id,
          start_job_date: employee.startJobDate,
          end_job_date: employee.endJobDate,
          category_id: employee.categoryId,
          employee_type_id: employee.employeeTypeId,
          direccion_id: employee.direccionId,
          created_at: new Date(),
        },
      });

      await tx.user.update({
        where: { id: createUser.id },
        data: { employee_id: createEmployee.id },
      });

      await tx.employee.update({
        where: { id: createEmployee.id },
        data: {
          employee_hiring_id: createEmployeeHiring.id,
        },
      });

      return [createUser, createEmployee, createEmployeeHiring, createEmployeeAddress];
    });
  },

  async getEmployeesByParams(employeeFilters: IEmployeeFilters) {
    const pageSize = employeeFilters.limit;
    const pageNumber = employeeFilters.page;
    const offset = (pageNumber - 1) * pageSize;
    const whereClause: any = {};

    if (employeeFilters.active) {
      whereClause.active = employeeFilters.active;
    }

    if (employeeFilters.employee_status) {
      whereClause.status_employee_id = employeeFilters.employee_status;
    }

    if (employeeFilters.gender) {
      whereClause.gender_id = employeeFilters.gender;
    }

    const employeeHiringConditions: any[] = [];

    if (employeeFilters.employee_type) {
      employeeHiringConditions.push({
        employee_type_id: employeeFilters.employee_type,
        active: true,
      });
    }

    if (employeeFilters.category) {
      employeeHiringConditions.push({
        category_id: employeeFilters.category,
        active: true,
      });
    }

    if (employeeFilters.direccion) {
      employeeHiringConditions.push({
        direccion_id: employeeFilters.direccion,
        active: true,
      });
    }

    if (employeeFilters.secretaria) {
      employeeHiringConditions.push({
        direccion: {
          secretaria_id: employeeFilters.secretaria,
          active: true,
        },
        active: true,
      });
    }

    if (
      employeeFilters.start_job_date_start ||
      employeeFilters.start_job_date_end ||
      employeeFilters.end_job_date_start ||
      employeeFilters.end_job_date_end
    ) {
      const rangeCondition: any = {};

      if (employeeFilters.start_job_date_start || employeeFilters.start_job_date_end) {
        rangeCondition.start_job_date = {};

        if (employeeFilters.start_job_date_start) {
          rangeCondition.start_job_date.gte = startOfDay(new Date(employeeFilters.start_job_date_start));
        }

        if (employeeFilters.start_job_date_end) {
          rangeCondition.start_job_date.lte = endOfDay(new Date(employeeFilters.start_job_date_end));
        }
      }

      if (employeeFilters.end_job_date_start || employeeFilters.end_job_date_end) {
        rangeCondition.end_job_date = {};

        if (employeeFilters.end_job_date_start) {
          rangeCondition.end_job_date.gte = startOfDay(new Date(employeeFilters.end_job_date_start));
        }

        if (employeeFilters.end_job_date_end) {
          rangeCondition.end_job_date.lte = endOfDay(new Date(employeeFilters.end_job_date_end));
        }
      }

      if (Object.keys(rangeCondition).length > 0) {
        employeeHiringConditions.push(rangeCondition);
      }
    }

    if (employeeHiringConditions.length > 0) {
      whereClause.employee_hiring = {
        some: {
          AND: employeeHiringConditions,
        },
      };
    }

    if (employeeFilters.location) {
      whereClause.employee_location = {
        some: {
          location_id: employeeFilters.location,
          active: true,
        },
      };
    }

    if (employeeFilters.search) {
      whereClause.OR = [
        {
          name: {
            contains: employeeFilters.search,
          },
        },
        {
          paternal_last_name: {
            contains: employeeFilters.search,
          },
        },
        {
          maternal_last_name: {
            contains: employeeFilters.search,
          },
        },
        {
          rfc: {
            contains: employeeFilters.search,
          },
        },
        {
          curp: {
            contains: employeeFilters.search,
          },
        },
        {
          number_employee: {
            contains: employeeFilters.search,
          },
        },
      ];
    }

    const data = await prisma.employee.findMany({
      where: whereClause,
      skip: offset,
      take: pageSize,
      orderBy: {
        id: "desc",
      },
      select: {
        id: true,
        name: true,
        paternal_last_name: true,
        maternal_last_name: true,
        number_employee: true,
        birthday: true,
        rfc: true,
        curp: true,
        gender_id: true,
        status_employee_id: true,
        active: true,
        created_at: true,
        updated_at: true,
        status_employee: true,
        user: false,
        user_id: false,
        gender: true,
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
        employee_location: {
          select: {
            id: true,
            location_id: true,
            active: true,
            created_at: true,
            updated_at: true,
            location: {
              select: {
                id: true,
                display_name: true,
              },
            },
          },
        },
        director_id: true,
        director: true,
        sustitute_id: true,
        sustitute: true,
        employee_created_by: false,
      },
    });

    const total = await prisma.employee.count({ where: whereClause });
    const totalPages = Math.ceil(total / pageSize);
    data.forEach((employee) => {
      (employee as any).employee_hiring_active = employee.employee_hiring.find((hiring: any) => hiring.active) || null;
    });
    data.forEach((employee) => {
      (employee as any).location_active = employee.employee_location.find((location: any) => location.active) || null;
    });
    const response = {
      data,
      total,
      totalPages,
      currentPage: pageNumber,
    };
    return response;
  },
};
