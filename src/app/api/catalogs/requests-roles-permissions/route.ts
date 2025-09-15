import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import { RequestsRolesPermissionsService } from "@/app/api/services/requests-roles-permissions";
import { getParamsFromUrl } from "@/common/utils";
import { logger } from "@/lib/logger";

const DEFAULT_LIMIT = 20;
const DEFAULT_PAGE = 1;

export async function GET(request: Request) {
  try {
    const params = {
      page: DEFAULT_PAGE,
      limit: DEFAULT_LIMIT,
      requestId: null,
      roleId: null,
      search: null,
    };

    const requestParams = await getParamsFromUrl(request, params);

    const data = await RequestsRolesPermissionsService.getRequestsRolesPermissionsByParams(requestParams);

    const response = HttpResponse.success(HttpMessages.catalog.success, data);

    return handleHttpResponse(response);
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack });

    const response = HttpResponse.internalServerError(HttpMessages.error.internalServerError, { error: error.message });

    return handleHttpResponse(response);
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, field, value } = body;

    if (!id || !field || typeof value !== "boolean") {
      const response = HttpResponse.failure(HttpMessages.error.invalidRequest, {
        error: "ID, field and boolean value are required",
      });
      return handleHttpResponse(response);
    }

    const allowedFields = [
      "can_view",
      "can_create",
      "can_approve",
      "can_reject",
      "can_cancel",
      "can_delete",
      "can_edit",
      "active",
    ];
    if (!allowedFields.includes(field)) {
      const response = HttpResponse.failure(HttpMessages.error.invalidRequest, {
        error: `Field must be one of: ${allowedFields.join(", ")}`,
      });
      return handleHttpResponse(response);
    }

    const data = await RequestsRolesPermissionsService.updateStatus(id, { [field]: value });

    const response = HttpResponse.success(HttpMessages.catalog.success, data);

    return handleHttpResponse(response);
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack });

    const response = HttpResponse.internalServerError(HttpMessages.error.internalServerError, { error: error.message });

    return handleHttpResponse(response);
  }
}
