import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import { getParamsFromUrl } from "@/common/utils";
import { logger } from "@/lib/logger";
import { authMiddleware } from "@/middleware/authMiddleware";
import { NextResponse } from "next/server";
import { IncidentsStatusService } from "@/app/api/services/incidents-status.service";
import { IncidentsRolesPermissionsService } from "@/app/api/services/incidents-roles-permissions";

export async function GET(request: Request) {
  const params = {
    incident_id: null,
  };

  const requestParams = await getParamsFromUrl(request, params);

  const authData = await authMiddleware();
  if (authData instanceof NextResponse) {
    return authData;
  }

  const { roleId } = authData;

  try {
    const incidentsStatus = await IncidentsStatusService.getIncidentsStatus();

    if (!requestParams.incident_id) {
      return handleHttpResponse(HttpResponse.success(HttpMessages.catalog.success, incidentsStatus));
    }

    const permissions = await IncidentsRolesPermissionsService.getIncidentsPermissionsByRole(
      Number(roleId),
      Number(requestParams.incident_id),
    );

    if (!permissions) {
      return handleHttpResponse(HttpResponse.notFound(HttpMessages.error.notFound, {}));
    }

    const filteredStatuses = incidentsStatus.filter((status) => {
      if (!status.permission_name) return false;

      return permissions[status.permission_name as keyof typeof permissions] === true;
    });

    return handleHttpResponse(HttpResponse.success(HttpMessages.catalog.success, filteredStatuses));
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack });

    const response = HttpResponse.internalServerError(HttpMessages.error.internalServerError, { error: error.message });

    return handleHttpResponse(response);
  }
}
