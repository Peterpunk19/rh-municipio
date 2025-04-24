import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import { CatalogsService } from "@/app/api/services/catalogs.service";
import { getParamsFromUrl } from "@/common/utils";
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
  const params = {
    request_id: null,
    search: null,
  };

  const requestParams = await getParamsFromUrl(request, params);

  try {
    const data = await CatalogsService.getRequestsStatus(requestParams);

    const response = HttpResponse.success(HttpMessages.catalog.success, data);

    return handleHttpResponse(response);
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack });

    const response = HttpResponse.internalServerError(HttpMessages.error.internalServerError, { error: error.message });

    return handleHttpResponse(response);
  }
}
