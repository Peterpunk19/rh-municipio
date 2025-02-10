import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { encryptPassword } from "@/common/utils";
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

    const lastNumber = parseInt(lastEmployee.number_employee, 10);
    return (lastNumber + 1).toString().padStart(6, "0");
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

    console.log(`Employee Filters ${JSON.stringify(employeeFilters)}`);

    if (employeeFilters.active) {
      whereClause.active = employeeFilters.active;
    }

    if (employeeFilters.status_employee_id) {
      whereClause.status_employee_id = employeeFilters.status_employee_id;
    }

    if (employeeFilters.location_id) {
      whereClause.locations = {
        some: {
          location_id: employeeFilters.location_id,
          active: true,
        },
      };
    }

    if (employeeFilters.start_date || employeeFilters.end_date) {
      whereClause.employee_hiring = {
        ...(employeeFilters.start_date && { start_job_date: { gte: employeeFilters.start_date } }),
        ...(employeeFilters.end_date && { end_job_date: { lte: employeeFilters.end_date } }),
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
        employee_hiring: true,
        employee_hiring_id: true,
        locations: true,
        director_id: true,
        director: true,
        sustitute_id: true,
        sustitute: true,
        employee_created_by: false,
      },
    });

    const total = await prisma.employee.count({ where: whereClause });
    const totalPages = Math.ceil(total / pageSize);
    const response = {
      data,
      total,
      totalPages,
      currentPage: pageNumber,
    };
    return response;
  },
};
