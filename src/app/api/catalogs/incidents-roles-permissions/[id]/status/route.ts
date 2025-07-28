import { validateRequest, validateRequestByUrlParams } from "@/common/request/validateRequest";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import { failureResponse, successResponse } from "@/common/utils";
import { logger } from "@/lib/logger";
import { NextRequest } from "next/server";
import { StatusCodes } from "http-status-codes";
import {
  IIncidentsRolesPermissionsById,
  IIncidentsRolesPermissionsUpdateStatus,
} from "@/app/api/catalogs/incidents-roles-permissions/types";
import {
  IncidentsRolesPermissionsByIdSchema,
  IncidentsRolesPermissionsUpdateStatusSchema,
} from "@/schemas/incidents-roles-permissions";
import { handleHttpResponse } from "@/common/response/handler";
import { IncidentsRolesPermissionsService } from "@/app/api/services/incidents-roles-permissions";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = Number.parseInt((await params).id);
    const requestParams: IIncidentsRolesPermissionsById = { id };

    const validationParams = await validateRequestByUrlParams<IIncidentsRolesPermissionsById>(
      requestParams,
      IncidentsRolesPermissionsByIdSchema,
    );

    if (validationParams.response) {
      return validationParams.response;
    }

    const validRequestData = validationParams.data;
    if (!validRequestData) {
      return failureResponse(HttpMessages.error.invalidRequest, {});
    }

    const validationBody = await validateRequest<IIncidentsRolesPermissionsUpdateStatus>(
      request,
      IncidentsRolesPermissionsUpdateStatusSchema,
    );
    if (validationBody.response) return validationBody.response;

    const body = validationBody.data;

    if (!body) {
      const response = HttpResponse.failure(HttpMessages.error.invalidRequest, {});
      return handleHttpResponse(response);
    }

    const data = await IncidentsRolesPermissionsService.updateStatus(id, body);

    return successResponse(HttpMessages.incidentsRolesPermissions.statusUpdatedSuccess, data);
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack });
    return failureResponse(
      HttpMessages.error.internalServerError,
      { error: HttpMessages.error.internalServerError },
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}
