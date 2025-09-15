import { RequestsRolesPermissionsService } from "./requests-roles-permissions";
import { logger } from "@/lib/logger";

export type PermissionType =
  | "can_create"
  | "can_edit"
  | "can_approve"
  | "can_reject"
  | "can_cancel"
  | "can_delete"
  | "can_view";

export class RequestsPermissionsValidator {
  static async validatePermission(roleId: number, requestId: number, permissionType: PermissionType): Promise<boolean> {
    try {
      const permission = await RequestsRolesPermissionsService.validateRequestsRolesPermissions(
        roleId,
        requestId,
        permissionType,
      );

      return !!permission && permission.active === true;
    } catch (error: any) {
      logger.error("Error validating permission:", { roleId, requestId, permissionType, error: error.message });
      return false;
    }
  }

  static async validateStatusTransition(
    roleId: number,
    requestId: number,
    currentStatus: string,
    targetStatus: string,
  ): Promise<boolean> {
    try {
      const statusTransitions: Record<string, Record<string, PermissionType>> = {
        creada: {
          aprobada: "can_approve",
          rechazada: "can_reject",
          cancelada: "can_cancel",
        },
        pendiente: {
          aprobada: "can_approve",
          rechazada: "can_reject",
          cancelada: "can_cancel",
        },
        aprobada: {
          cancelada: "can_cancel",
        },
        rechazada: {
          pendiente: "can_edit",
          creada: "can_edit",
        },
      };

      const transition = statusTransitions[currentStatus]?.[targetStatus];

      if (!transition) {
        return false;
      }

      return await this.validatePermission(roleId, requestId, transition);
    } catch (error: any) {
      logger.error("Error validating status transition:", {
        roleId,
        requestId,
        currentStatus,
        targetStatus,
        error: error.message,
      });
      return false;
    }
  }
}
