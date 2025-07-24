import { NextRequest } from "next/server";
import { IncidentRulesService } from "@/app/api/services/incident-rules.service";
import { IncidentRulesValidationSchema } from "@/schemas/incident-rules";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import { handleHttpResponse } from "@/common/response/handler";
import { getParamsFromUrl } from "@/common/utils";
import { validateRequestByUrlParams } from "@/common/request/validateRequest";
import { logger } from "@/lib/logger";
import { authMiddleware } from "@/middleware/authMiddleware";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const authData = await authMiddleware();
    if (authData instanceof NextResponse) {
      return authData;
    }
    const params = {
      employeeId: null,
      incidentId: null,
      startDate: null,
      endDate: null,
    };
    const requestParams = await getParamsFromUrl(request, params);
    const validationRequest = await validateRequestByUrlParams(requestParams, IncidentRulesValidationSchema);
    if (validationRequest.response) return validationRequest.response;

    const validRequestData = validationRequest.data;
    if (!validRequestData) {
      const response = HttpResponse.failure(HttpMessages.error.validationFields, {});
      return handleHttpResponse(response);
    }

    const { employeeId, incidentId, startDate, endDate } = validRequestData;
    const validation = await IncidentRulesService.validateIncidentRule({
      employeeId: Number(employeeId),
      incidentId: Number(incidentId),
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
    return handleHttpResponse(validation);
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack });
    const response = HttpResponse.failure(HttpMessages.error.internalServerError, {});
    return handleHttpResponse(response);
  }
}
