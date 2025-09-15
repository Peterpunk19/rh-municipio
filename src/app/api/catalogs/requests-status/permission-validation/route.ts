import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import { getParamsFromUrl } from "@/common/utils";
import { logger } from "@/lib/logger";
import { authMiddleware } from "@/middleware/authMiddleware";
import { NextResponse } from "next/server";
import { RequestsStatusService } from "@/app/api/services/requests-status.service";
import { RequestsRolesPermissionsService } from "@/app/api/services/requests-roles-permissions";
import { REQUEST_STATUS_ID } from "@/common/constants/RequestStatus";

export async function GET(request: Request) {
  const params = {
    request_id: null,
  };

  const requestParams = await getParamsFromUrl(request, params);

  const authData = await authMiddleware();
  if (authData instanceof NextResponse) {
    return authData;
  }

  const { roleId } = authData;

  try {
    const requestsStatus = await RequestsStatusService.getRequestsStatus();

    if (!requestParams.request_id) {
      return handleHttpResponse(HttpResponse.success(HttpMessages.catalog.success, requestsStatus));
    }

    const requestId = Number(requestParams.request_id);

    const permissions = await RequestsRolesPermissionsService.getRequestsPermissionsByRole(Number(roleId), requestId);

    if (!permissions) {
      return handleHttpResponse(HttpResponse.notFound(HttpMessages.error.notFound, {}));
    }

    const filteredStatuses = requestsStatus.filter((status) => {
      if (status.id === REQUEST_STATUS_ID.CREADA) return false;

      if (!status.permission_name) return false;

      const hasBasicPermission = permissions[status.permission_name as keyof typeof permissions] === true;
      if (!hasBasicPermission) return false;

      return true;
    });

    return handleHttpResponse(HttpResponse.success(HttpMessages.catalog.success, filteredStatuses));
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack });

    const response = HttpResponse.internalServerError(HttpMessages.error.internalServerError, { error: error.message });

    return handleHttpResponse(response);
  }
}
