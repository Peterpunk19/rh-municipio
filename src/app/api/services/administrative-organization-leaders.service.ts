import { prisma } from "@/lib/prisma";
import type { ICreateLeader, IAdministrativeOrganizationsFilters } from "@/app/api/administrative-organizations/types";
import { buildWhereClause, getPaginationData } from "@/common/utils";
import { ROLES } from "@/common/constants/Roles";

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

  async getAdministrativeOrganizationsByParams(
    administrativeOrganizationsFilters: IAdministrativeOrganizationsFilters,
  ) {
    const { limit, page } = administrativeOrganizationsFilters;
    const offset = (Number(page) - 1) * Number(limit);

    const whereClause: any = {};

    if (administrativeOrganizationsFilters.search) {
      whereClause.OR = [
        { display_name: { contains: administrativeOrganizationsFilters.search } },
        {
          direcciones: {
            some: {
              OR: [
                { display_name: { contains: administrativeOrganizationsFilters.search } },
                {
                  leaders: {
                    some: {
                      employee: {
                        OR: [
                          { name: { contains: administrativeOrganizationsFilters.search } },
                          { paternal_last_name: { contains: administrativeOrganizationsFilters.search } },
                          { maternal_last_name: { contains: administrativeOrganizationsFilters.search } },
                        ],
                      },
                    },
                  },
                },
              ],
            },
          },
        },
      ];
    }

    const data = await prisma.secretaria.findMany({
      where: whereClause,
      skip: offset,
      take: Number(limit),
      orderBy: {
        display_name: "asc",
      },
      select: {
        id: true,
        name: true,
        display_name: true,
        direcciones: {
          where: {
            active: true,
          },
          orderBy: {
            display_name: "asc",
          },
          select: {
            id: true,
            name: true,
            display_name: true,
            leaders: {
              where: {
                active: true,
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
                role: {
                  select: {
                    name: true,
                  },
                },
                start_date: true,
                end_date: true,
              },
            },
          },
        },
      },
    });

    const administrativeOrganizations = data.map((item: any) => ({
      id: item.id,
      name: item.name,
      display_name: item.display_name,
      direcciones: item.direcciones.map((direccion: any) => {
        const director = direccion.leaders.find((leader: any) => leader.role.name === ROLES.DIRECTOR);
        const deputyDirector = direccion.leaders.find((leader: any) => leader.role.name === ROLES.SUPLENTE);

        const getFullName = (employee: any) =>
          employee ? `${employee.paternal_last_name} ${employee.maternal_last_name} ${employee.name}` : null;

        return {
          id: direccion.id,
          name: direccion.display_name,
          director: { id: director?.employee.id ?? "", name: getFullName(director?.employee) },
          deputy_director: { id: deputyDirector?.employee.id ?? "", name: getFullName(deputyDirector?.employee) },
          startDate: director?.start_date ?? null,
          endDate: director?.end_date ?? null,
        };
      }),
    }));

    const total = await prisma.secretaria.count({ where: whereClause });
    const pagination = await getPaginationData(total, Number(limit), Number(page));

    return { ...pagination, administrativeOrganizations };
  },
};
