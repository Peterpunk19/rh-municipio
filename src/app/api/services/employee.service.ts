import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { encryptPassword } from "@/common/utils";
import { IEmployee } from "@/app/api/employees/interface";

export const EmployeeService = {
  async getEmployeeByRfcCurp(rfc: string, curp: string) {
    return prisma.employee.findFirst({
      where: {
        OR: [{ rfc }, { curp }],
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

      await tx.user.update({
        where: { id: createUser.id },
        data: { employee_id: createEmployee.id },
      });

      return [createUser, createEmployee];
    });
  },
};
