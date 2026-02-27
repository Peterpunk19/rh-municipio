import { prisma } from "@/lib/prisma";
import { buildWhereClause, getPaginationData } from "@/common/utils";
import { IIncidentsRolesPermissionsFilters } from "@/app/api/catalogs/incidents-roles-permissions/types";

export const IncidentsRolesPermissionsService = {
  async getIncidentsRolesPermissionsByParams(filters: IIncidentsRolesPermissionsFilters) {
    const limit = filters.limit;
    const page = filters.page;
    const offset = (page - 1) * limit;

    const filterMappings = {
      incidentId: {
        path: "incident_id",
      },
      roleId: {
        path: "role_id",
      },
    };

    const searchMappings = [
      { path: ["incident", "name"], operators: ["is", "contains"] },
      { path: ["role", "name"], operators: ["is", "contains"] },
    ];

    const whereClause: any = await buildWhereClause(filterMappings, filters, searchMappings);

    const data = await prisma.incidentsRolesPermissions.findMany({
      where: whereClause,
      skip: offset,
      take: limit,
      orderBy: {
        id: "desc",
      },
      select: {
        id: true,
        role_id: true,
        role: {
          select: {
            id: true,
            name: true,
            display_name: true,
          },
        },
        incident_id: true,
        incident: {
          select: {
            id: true,
            name: true,
            display_name: true,
          },
        },
        can_view: true,
        can_create: true,
        can_validate: true,
        can_approve: true,
        can_reject: true,
        can_cancel: true,
        can_delete: true,
        can_edit: true,
        active: true,
      },
    });

    const total = await prisma.incidentsRolesPermissions.count({ where: whereClause });
    const pagination = await getPaginationData(total, limit, page);

    return { ...pagination, data };
  },

  async updateStatus(id: number, data: any) {
    return await prisma.incidentsRolesPermissions.update({
      where: { id: id },
      data: data,
    });
  },

  async validateIncidentsRolesPermissions(
    roleId: number,
    incidentId: number,
    permissionType:
      | "can_create"
      | "can_validate"
      | "can_update"
      | "can_reject"
      | "can_approve"
      | "can_cancel"
      | "can_delete"
      | "can_edit",
  ) {
    return await prisma.incidentsRolesPermissions.findFirst({
      where: {
        role_id: roleId,
        incident_id: incidentId,
        [permissionType]: true,
      },
    });
  },

  async getIncidentsPermissionsByRole(roleId: number, incidentId: number) {
    return prisma.incidentsRolesPermissions.findFirst({
      where: {
        incident_id: incidentId,
        role_id: roleId,
      },
    });
  },

  async getIncidentsByRoleWithCreatePermission(roleId: number) {
    return await prisma.incident.findMany({
      where: {
        incidents_roles_permissions: {
          some: {
            role_id: roleId,
            can_create: true,
          },
        },
      },
      orderBy: { display_name: "asc" },
    });
  },
};
