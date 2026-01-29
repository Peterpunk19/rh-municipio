import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import { EmployeeIncidentsService } from "@/app/api/services/employee-incidents.service";
import { getParamsFromUrl } from "@/common/utils";

export async function GET(request: Request) {
  const params = {
    createdAt: null,
  };

  const requestParams = await getParamsFromUrl(request, params);

  try {
    const data = await EmployeeIncidentsService.dashboardIncidentsStatus(requestParams as { createdAt: string });

    const response = HttpResponse.success(HttpMessages.catalog.success, data);

    return handleHttpResponse(response);
  } catch (error: any) {
    const response = HttpResponse.internalServerError(HttpMessages.error.internalServerError, { error: error.message });

    return handleHttpResponse(response);
  }
}
