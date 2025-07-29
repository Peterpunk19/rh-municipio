import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import { IncidentsRolesPermissionsService } from "@/app/api/services/incidents-roles-permissions";
import { getParamsFromUrl } from "@/common/utils";
import { logger } from "@/lib/logger";

const DEFAULT_LIMIT = 20;
const DEFAULT_PAGE = 1;

export async function GET(request: Request) {
  try {
    const params = {
      page: DEFAULT_PAGE,
      limit: DEFAULT_LIMIT,
      incidentId: null,
      roleId: null,
      search: null,
    };

    const requestParams = await getParamsFromUrl(request, params);

    const data = await IncidentsRolesPermissionsService.getIncidentsRolesPermissionsByParams(requestParams);

    const response = HttpResponse.success(HttpMessages.catalog.success, data);

    return handleHttpResponse(response);
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack });

    const response = HttpResponse.internalServerError(HttpMessages.error.internalServerError, { error: error.message });

    return handleHttpResponse(response);
  }
}
