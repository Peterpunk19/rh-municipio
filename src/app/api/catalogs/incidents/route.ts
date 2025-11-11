import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import { CatalogsService } from "@/app/api/services/catalogs.service";
import { NextRequest } from "next/server";
import { getParamsFromUrl } from "@/common/utils";
import { authMiddleware } from "@/middleware/authMiddleware";
import { ICatalogFilters } from "@/interfaces/Catalogs";
import { validateRequestByUrlParams } from "@/common/request/validateRequest";
import { IncidentFilterSchema } from "@/schemas/catalogs";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const requestParams = {
      page: null,
      limit: null,
      search: null,
      active: null,
    };

    const params = await getParamsFromUrl(request, requestParams);

    const authData = await authMiddleware();

    if (authData instanceof NextResponse) {
      return authData;
    }

    let filters: ICatalogFilters | undefined;

    if (params.page || params.limit || params.search) {
      const validationRequest = await validateRequestByUrlParams<ICatalogFilters>(params, IncidentFilterSchema);

      if (validationRequest.response) return validationRequest.response;

      if (!validationRequest.data) {
        const response = HttpResponse.failure(HttpMessages.error.validationFields, {});
        return handleHttpResponse(response);
      }

      filters = validationRequest.data;
    }

    const roleId = request.nextUrl.searchParams.get("roleId");
    const data = roleId
      ? await CatalogsService.getIncidentsByRoleCanCreate(Number(roleId))
      : await CatalogsService.getIncidents(filters);

    const response = HttpResponse.success(HttpMessages.catalog.success, data);

    return handleHttpResponse(response);
  } catch (error: any) {
    const response = HttpResponse.internalServerError(HttpMessages.error.internalServerError, { error: error.message });

    return handleHttpResponse(response);
  }
}
