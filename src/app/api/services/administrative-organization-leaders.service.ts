import { prisma } from "@/lib/prisma";
import type {
  ICreateLeader,
  IAdministrativeOrganizationsFilters,
  ILeadersFilters,
} from "@/app/api/administrative-organizations/types";
import { buildWhereClause, getPaginationData } from "@/common/utils";
import { ROLES, ROLES_ID_VALUES } from "@/common/constants/Roles";

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
        include: {
          employee: {
            select: {
              name: true,
              paternal_last_name: true,
              maternal_last_name: true,
            },
          },
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
          employee: {
            name: existingIdenticalLeader.employee.name,
            paternal_last_name: existingIdenticalLeader.employee.paternal_last_name,
            maternal_last_name: existingIdenticalLeader.employee.maternal_last_name,
          },
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
        const startDateObj = new Date(leader.startDate);
        startDateObj.setDate(startDateObj.getDate() - 1);
        const endDate = startDateObj;
        await tx.administrativeOrganizationLeaders.update({
          where: { id: activeLeader.id },
          data: {
            active: false,
            updated_at: new Date(),
            end_date: endDate,
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
          employee: {
            select: {
              name: true,
              paternal_last_name: true,
              maternal_last_name: true,
            },
          },
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
            user_direcciones: {
              where: {
                active: true,
              },
              select: {
                id: true,
                user: {
                  select: {
                    id: true,
                    username: true,
                    role_id: true,
                  },
                },
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

        const ENLACE_ID = ROLES_ID_VALUES[ROLES.ENLACE as keyof typeof ROLES_ID_VALUES];
        const SUBENLACE_ID = ROLES_ID_VALUES[ROLES.SUBENLACE as keyof typeof ROLES_ID_VALUES];
        const enlace = direccion.user_direcciones.find((userDir: any) => userDir.user.role_id === ENLACE_ID);
        const subenlace = direccion.user_direcciones.find((userDir: any) => userDir.user.role_id === SUBENLACE_ID);

        return {
          id: direccion.id,
          name: direccion.display_name,
          director: {
            id: director?.employee.id ?? "",
            name: getFullName(director?.employee),
            startDate: director?.start_date ?? null,
            endDate: director?.end_date ?? null,
          },
          deputy_director: { id: deputyDirector?.employee.id ?? "", name: getFullName(deputyDirector?.employee) },
          enlace: { id: enlace?.user.id, username: enlace?.user.username },
          subenlace: { id: subenlace?.user.id, username: subenlace?.user.username },
        };
      }),
    }));

    const total = await prisma.secretaria.count({ where: whereClause });
    const pagination = await getPaginationData(total, Number(limit), Number(page));

    return { ...pagination, administrativeOrganizations };
  },

  async getDireccionById(direccionId: number) {
    return prisma.direccion.findUnique({
      where: {
        id: direccionId,
      },
      include: {
        user_direcciones: {
          where: {
            active: true,
          },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                role_id: true,
                role: {
                  select: {
                    id: true,
                    name: true,
                    display_name: true,
                  },
                },
                active: true,
              },
            },
          },
        },
      },
    });
  },

  async getLeadersByParams(leadersFilters: ILeadersFilters) {
    const { limit, page, startDate, endDate } = leadersFilters;
    const offset = (Number(page) - 1) * Number(limit);
    const filterMappings = {
      active: "active",
      direccionId: "direccion_id",
      roleId: "role_id",
    };

    const whereClause = await buildWhereClause(filterMappings, leadersFilters);
    if (startDate) {
      whereClause.end_date = {
        ...(whereClause.end_date || {}),
        gte: startDate,
      };
    }

    if (endDate) {
      whereClause.start_date = {
        ...(whereClause.start_date || {}),
        lte: endDate,
      };
    }

    const data = await prisma.administrativeOrganizationLeaders.findMany({
      where: whereClause,
      skip: offset,
      take: Number(limit),
      orderBy: {
        start_date: "desc",
      },
      select: {
        id: true,
        direccion_id: true,
        active: true,
        start_date: true,
        end_date: true,
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
      },
    });

    const total = await prisma.administrativeOrganizationLeaders.count({ where: whereClause });
    const pagination = await getPaginationData(total, Number(limit), Number(page));

    const leaders = data.map((leader) => ({
      id: leader.id,
      direccion_id: leader.direccion_id,
      active: leader.active,
      start_date: leader.start_date,
      end_date: leader.end_date,
      employee: {
        id: leader.employee.id,
        name: leader.employee.name,
        paternal_last_name: leader.employee.paternal_last_name,
        maternal_last_name: leader.employee.maternal_last_name,
      },
      role: {
        name: leader.role.name,
      },
    }));

    return { ...pagination, leaders };
  },
};
