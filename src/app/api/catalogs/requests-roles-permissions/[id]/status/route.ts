import { validateRequest, validateRequestByUrlParams } from "@/common/request/validateRequest";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import { failureResponse, successResponse } from "@/common/utils";
import { logger } from "@/lib/logger";
import { NextRequest } from "next/server";
import { StatusCodes } from "http-status-codes";
import {
  IRequestsRolesPermissionsById,
  IRequestsRolesPermissionsUpdateStatus,
} from "@/app/api/catalogs/requests-roles-permissions/types";
import {
  RequestsRolesPermissionsByIdSchema,
  RequestsRolesPermissionsUpdateStatusSchema,
} from "@/schemas/requests-roles-permissions";
import { handleHttpResponse } from "@/common/response/handler";
import { RequestsRolesPermissionsService } from "@/app/api/services/requests-roles-permissions";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = Number.parseInt((await params).id);
    const requestParams: IRequestsRolesPermissionsById = { id };

    const validationParams = await validateRequestByUrlParams<IRequestsRolesPermissionsById>(
      requestParams,
      RequestsRolesPermissionsByIdSchema,
    );

    if (validationParams.response) {
      return validationParams.response;
    }

    const validRequestData = validationParams.data;
    if (!validRequestData) {
      return failureResponse(HttpMessages.error.invalidRequest, {});
    }

    const validationBody = await validateRequest<IRequestsRolesPermissionsUpdateStatus>(
      request,
      RequestsRolesPermissionsUpdateStatusSchema,
    );
    if (validationBody.response) return validationBody.response;

    const body = validationBody.data;

    if (!body) {
      const response = HttpResponse.failure(HttpMessages.error.invalidRequest, {});
      return handleHttpResponse(response);
    }

    const data = await RequestsRolesPermissionsService.updateStatus(id, body);

    return successResponse(HttpMessages.requestsRolesPermissions.statusUpdatedSuccess, data);
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack });

    return failureResponse(
      HttpMessages.error.internalServerError,
      { error: HttpMessages.error.internalServerError },
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}
