import { handleHttpResponse } from "@/common/response/handler";
import { validateRequestByUrlParams } from "@/common/request/validateRequest";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import type { IAdministrativeOrganizationsFilters } from "@/app/api/administrative-organizations/types";
import { AdministrativeOrganizationsGetFilterSchema } from "@/schemas/administrative-organization-leaders";
import { AdministrativeOrganizationLeadersService } from "@/app/api/services/administrative-organization-leaders.service";
import { getParamsFromUrl } from "@/common/utils";
import { authMiddleware } from "@/middleware/authMiddleware";
import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
  try {
    const params = {
      page: 1,
      limit: 50,
      search: null,
    };

    const requestParams = await getParamsFromUrl(request, params);

    const authData = await authMiddleware();

    if (authData instanceof NextResponse) {
      return authData;
    }

    const validationRequest = await validateRequestByUrlParams<IAdministrativeOrganizationsFilters>(
      requestParams,
      AdministrativeOrganizationsGetFilterSchema,
    );

    if (validationRequest.response) return validationRequest.response;

    const validRequestData = validationRequest.data;

    if (!validRequestData) {
      const response = HttpResponse.failure(HttpMessages.error.validationFields, {});
      return handleHttpResponse(response);
    }

    const administrativeOrganizations =
      await AdministrativeOrganizationLeadersService.getAdministrativeOrganizationsByParams(validRequestData);

    if (administrativeOrganizations && administrativeOrganizations.total === 0) {
      const response = HttpResponse.success(HttpMessages.administrativeOrganizations.notFound, {
        administrativeOrganizations: [],
        total: 0,
        totalPages: 0,
        currentPage: 1,
      });

      return handleHttpResponse(response);
    }

    const response = HttpResponse.success(
      HttpMessages.administrativeOrganizations.getSuccess,
      administrativeOrganizations,
    );

    return handleHttpResponse(response);
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack });

    const response = HttpResponse.failure(HttpMessages.error.internalServerError, error);
    return handleHttpResponse(response);
  }
}
