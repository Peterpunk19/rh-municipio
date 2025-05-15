import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import { CatalogsService } from "@/app/api/services/catalogs.service";
import { getParamsFromUrl } from "@/common/utils";
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
  const params = {
    employee_attendance_id: null,
    area_id: null,
    direccion_id: null,
    employee_id: null,
    incident_id: null,
    incident_status_id: null,
    start_date: null,
    end_date: null,
    created_at: null,
    search: null,
  };

  const requestParams = await getParamsFromUrl(request, params);

  try {
    const data = await CatalogsService.getIncidentsStatus(requestParams);

    const response = HttpResponse.success(HttpMessages.catalog.success, data);

    return handleHttpResponse(response);
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack });

    const response = HttpResponse.internalServerError(HttpMessages.error.internalServerError, { error: error.message });

    return handleHttpResponse(response);
  }
}
