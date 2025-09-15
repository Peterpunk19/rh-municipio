import { prisma } from "@/lib/prisma";
import { buildWhereClause, getPaginationData } from "@/common/utils";
import { IRequestsRolesPermissionsFilters } from "@/app/api/catalogs/requests-roles-permissions/types";

export const RequestsRolesPermissionsService = {
  async getRequestsRolesPermissionsByParams(filters: IRequestsRolesPermissionsFilters) {
    const limit = filters.limit;
    const page = filters.page;
    const offset = (page - 1) * limit;

    const filterMappings = {
      requestId: {
        path: "request_id",
      },
      roleId: {
        path: "role_id",
      },
    };

    const searchMappings = [
      { path: ["request", "name"], operators: ["is", "contains"] },
      { path: ["role", "name"], operators: ["is", "contains"] },
    ];

    const whereClause: any = await buildWhereClause(filterMappings, filters, searchMappings);

    const data = await prisma.requestsRolesPermissions.findMany({
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
        request_id: true,
        request: {
          select: {
            id: true,
            name: true,
            display_name: true,
          },
        },
        can_view: true,
        can_create: true,
        can_approve: true,
        can_reject: true,
        can_cancel: true,
        can_delete: true,
        can_edit: true,
        active: true,
      },
    });

    const total = await prisma.requestsRolesPermissions.count({ where: whereClause });
    const pagination = await getPaginationData(total, limit, page);

    return { ...pagination, data };
  },

  async updateStatus(id: number, data: any) {
    return await prisma.requestsRolesPermissions.update({
      where: { id: id },
      data: data,
    });
  },

  async validateRequestsRolesPermissions(
    roleId: number,
    requestId: number,
    permissionType:
      | "can_create"
      | "can_update"
      | "can_reject"
      | "can_approve"
      | "can_cancel"
      | "can_delete"
      | "can_edit"
      | "can_view",
  ) {
    return await prisma.requestsRolesPermissions.findFirst({
      where: {
        role_id: roleId,
        request_id: requestId,
        [permissionType]: true,
      },
    });
  },

  async getRequestsPermissionsByRole(roleId: number, requestId: number) {
    return prisma.requestsRolesPermissions.findFirst({
      where: {
        request_id: requestId,
        role_id: roleId,
      },
    });
  },
};
