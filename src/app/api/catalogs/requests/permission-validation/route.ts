import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import { logger } from "@/lib/logger";
import { authMiddleware } from "@/middleware/authMiddleware";
import { NextResponse } from "next/server";
import { CatalogsService } from "@/app/api/services/catalogs.service";
import { RequestsRolesPermissionsService } from "@/app/api/services/requests-roles-permissions";

export async function GET() {
  const authData = await authMiddleware();
  if (authData instanceof NextResponse) {
    return authData;
  }

  const { roleId } = authData;

  try {
    const requestTypes = await CatalogsService.getRequestsTypes();

    const filteredRequestTypes = [];

    for (const requestType of requestTypes) {
      const permissions = await RequestsRolesPermissionsService.getRequestsPermissionsByRole(
        Number(roleId),
        Number(requestType.id),
      );

      if (permissions && permissions.can_create === true) {
        filteredRequestTypes.push(requestType);
      }
    }

    return handleHttpResponse(HttpResponse.success(HttpMessages.catalog.success, filteredRequestTypes));
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack });

    const response = HttpResponse.internalServerError(HttpMessages.error.internalServerError, { error: error.message });

    return handleHttpResponse(response);
  }
}
