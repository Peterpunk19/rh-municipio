import { prisma } from "@/lib/prisma";
import type { ICreateLeader } from "@/app/api/administrative-organizations/types";

export const AdministrativeOrganizationLeadersService = {
  async createLeader(leader: ICreateLeader) {
    return await prisma.$transaction(async (tx) => {
      const existingIdenticalLeader = await tx.administrativeOrganizationLeaders.findFirst({
        where: {
          direccion_id: leader.direccionId,
          role_id: leader.roleId,
          employee_id: leader.employeeId,
          start_date: new Date(leader.startDate),
          end_date: new Date(leader.endDate),
          active: true,
        },
      });

      if (existingIdenticalLeader) {
        return {
          id: existingIdenticalLeader.id,
          direccion_id: existingIdenticalLeader.direccion_id,
          employee_id: existingIdenticalLeader.employee_id,
          role_id: existingIdenticalLeader.role_id,
          active: existingIdenticalLeader.active,
          start_date: existingIdenticalLeader.start_date,
          end_date: existingIdenticalLeader.end_date,
        };
      }

      const activeLeader = await tx.administrativeOrganizationLeaders.findFirst({
        where: {
          direccion_id: leader.direccionId,
          role_id: leader.roleId,
          active: true,
        },
      });

      if (activeLeader) {
        await tx.administrativeOrganizationLeaders.update({
          where: { id: activeLeader.id },
          data: {
            active: false,
            updated_at: new Date(),
          },
        });
      }

      return await tx.administrativeOrganizationLeaders.create({
        data: {
          direccion: {
            connect: { id: leader.direccionId },
          },
          employee: {
            connect: { id: leader.employeeId },
          },
          role: {
            connect: { id: leader.roleId },
          },
          created_by: {
            connect: { id: leader.createdById },
          },
          active: true,
          start_date: leader.startDate,
          end_date: leader.endDate,
        },
        select: {
          id: true,
          direccion_id: true,
          employee_id: true,
          role_id: true,
          active: true,
          start_date: true,
          end_date: true,
        },
      });
    });
  },

  async deactivateLeader(direccionId: number, roleId: number, createdById: number) {
    return await prisma.administrativeOrganizationLeaders.updateMany({
      where: {
        direccion_id: direccionId,
        role_id: roleId,
        active: true,
      },
      data: {
        active: false,
        updated_at: new Date(),
        created_by_id: createdById,
      },
    });
  },
};
