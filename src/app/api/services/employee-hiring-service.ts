import { prisma } from "@/lib/prisma";
import { STATUS_EMPLOYEE_ID } from "@/common/constants/StatusEmployee";

type TerminateEmployeeHiringInput = {
  employeeHiringId: number;
  terminationDate: Date;
  reason?: string;
  comments?: string;
  userId: number;
};

type CreateEmployeeHiringInput = {
  employeeId: number;
  startJobDate: Date;
  endJobDate?: Date | null;
  categoryId: number;
  employeeTypeId: number;
  direccionId: number;
  userId: number;
};

export const EmployeeHiringService = {
  async terminateEmployeeHiring({
    employeeHiringId,
    terminationDate,
    reason,
    comments,
    userId,
  }: TerminateEmployeeHiringInput) {
    return prisma.$transaction(async (tx) => {
      const hiring = await tx.employeeHiring.findUnique({
        where: { id: employeeHiringId },
        include: {
          employee_ascriptions: {
            where: { active: true },
            orderBy: { start_date: "desc" },
          },
        },
      });

      if (!hiring) {
        throw new Error("El contrato no existe");
      }

      if (!hiring.active || hiring.end_job_date) {
        throw new Error("El contrato ya fue terminado");
      }

      console.log(terminationDate);
      console.log(hiring.start_job_date);

      if (terminationDate < hiring.start_job_date) {
        throw new Error("La fecha de baja no puede ser menor a la fecha de alta");
      }

      await tx.employeeHiring.update({
        where: { id: hiring.id },
        data: {
          end_job_date: terminationDate,
          active: false,
          updated_at: new Date(),
        },
      });

      await tx.employeeAscriptions.updateMany({
        where: {
          employee_hiring_id: hiring.id,
          active: true,
        },
        data: {
          end_date: terminationDate,
          active: false,
          updated_at: new Date(),
        },
      });

      const termination = await tx.employeeHiringTermination.create({
        data: {
          employee_hiring_id: hiring.id,
          employee_id: hiring.employee_id,
          termination_date: terminationDate,
          reason: reason || null,
          comments: comments || null,
          created_by_id: userId,
        },
      });

      await tx.employee.updateMany({
        where: {
          id: hiring.employee_id,
        },
        data: {
          status_employee_id: STATUS_EMPLOYEE_ID.INACTIVO,
          active: false,
          updated_at: new Date(),
        },
      });

      return {
        employeeHiringId: hiring.id,
        employeeId: hiring.employee_id,
        terminationId: termination.id,
      };
    });
  },

  async createEmployeeHiring({
    employeeId,
    startJobDate,
    endJobDate,
    categoryId,
    employeeTypeId,
    direccionId,
    userId,
  }: CreateEmployeeHiringInput) {
    return prisma.$transaction(async (tx) => {
      const employee = await tx.employee.findUnique({
        where: { id: employeeId },
      });

      if (!employee) {
        throw new Error("El empleado no existe");
      }

      const activeHiring = await tx.employeeHiring.findFirst({
        where: {
          employee_id: employeeId,
          active: true,
          end_job_date: null,
        },
      });

      if (activeHiring) {
        throw new Error("El empleado ya cuenta con un contrato activo");
      }

      if (endJobDate && endJobDate < startJobDate) {
        throw new Error("La fecha de baja no puede ser menor a la fecha de alta");
      }

      const createdHiring = await tx.employeeHiring.create({
        data: {
          employee_id: employeeId,
          start_job_date: startJobDate,
          end_job_date: endJobDate || null,
          category_id: categoryId,
          employee_type_id: employeeTypeId,
          active: !endJobDate,
          created_by: userId,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      const createdAscription = await tx.employeeAscriptions.create({
        data: {
          employee_id: employeeId,
          employee_hiring_id: createdHiring.id,
          direccion_id: direccionId,
          active: !endJobDate,
          start_date: startJobDate,
          end_date: endJobDate || null,
          created_by_id: userId,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      await tx.employee.update({
        where: { id: employeeId },
        data: {
          status_employee_id: STATUS_EMPLOYEE_ID.ACTIVO,
          active: true,
          updated_at: new Date(),
        },
      });

      return {
        employeeHiringId: createdHiring.id,
        employeeAscriptionId: createdAscription.id,
        employeeId,
      };
    });
  },
};
