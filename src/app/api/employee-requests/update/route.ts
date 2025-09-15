import { type NextRequest, NextResponse } from "next/server";
import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { validateRequest } from "@/common/request/validateRequest";
import { HttpMessages } from "@/common/response/messages";
import type { IEmployeeRequestUpdate } from "@/app/api/employee-requests/types";
import { EmployeeRequestsUpdateSchema } from "@/schemas/employee-requests";
import { EmployeeRequestService } from "@/app/api/services/employee-request.service";
import { logger } from "@/lib/logger";
import { failureResponse } from "@/common/utils";
import { authMiddleware } from "@/middleware/authMiddleware";
import { validateRequestsRolesPermissions } from "@/app/api/common/utils.service";
import { CatalogsService } from "@/app/api/services/catalogs.service";
import { RequestsPermissionsValidator } from "@/app/api/services/requests-permissions-validator.service";
import { EmployeeRequestsStatusService } from "@/app/api/services/employee-requests-status.service";
import { REQUEST_STATUS_ID } from "@/common/constants/RequestStatus";

export async function PUT(request: NextRequest) {
  try {
    const authData = await authMiddleware();

    if (authData instanceof NextResponse) {
      return authData;
    }

    const { userId: userAuthenticatedId, roleId: userAuthenticatedRoleId } = authData;

    const validationRequest = await validateRequest<IEmployeeRequestUpdate>(request, EmployeeRequestsUpdateSchema);
    if (validationRequest.response) return validationRequest.response;

    const body = validationRequest.data;
    if (!body) return failureResponse(HttpMessages.error.invalidRequest);

    const employeeRequestId = Number(body.requestId);
    const requestStatusId = Number(body.statusId);

    if (!Object.values(REQUEST_STATUS_ID).includes(requestStatusId))
      return failureResponse(HttpMessages.requestStatus.invalidStatus);

    const existingRequestStatusId = await CatalogsService.getCatalogById("requestStatus", requestStatusId);

    if (!existingRequestStatusId) return failureResponse(HttpMessages.requestStatus.idNotFound);

    const employeeRequest = await EmployeeRequestService.getEmployeeRequestById(employeeRequestId);

    if (!employeeRequest) return failureResponse(HttpMessages.employeeRequests.notFoundById);

    const permissionValidation = await validateRequestsRolesPermissions(
      userAuthenticatedRoleId,
      employeeRequest.request.id,
      existingRequestStatusId.permission_name,
    );
    if (!permissionValidation)
      return failureResponse(HttpMessages.employeeRequests.requestsRolesPermissionsUpdateFailed);

    const currentStatus = employeeRequest.request_status.name;
    const targetStatus = existingRequestStatusId.name;

    const canTransition = await RequestsPermissionsValidator.validateStatusTransition(
      userAuthenticatedRoleId,
      employeeRequest.request.id,
      currentStatus,
      targetStatus,
    );

    if (!canTransition) {
      return failureResponse(
        HttpMessages.employeeRequests["invalidStatusTransition"] || "Transición de estado no válida para tu rol",
      );
    }

    if (requestStatusId === REQUEST_STATUS_ID.CANCELADA && employeeRequest.requestedBy.id !== userAuthenticatedId) {
      return failureResponse(HttpMessages.employeeRequests.invalidUserToCancel);
    }

    if (employeeRequest.request_status.id === requestStatusId)
      return failureResponse(HttpMessages.employeeRequests.invalidUpdateData);

    const validateEmployeeRequestStatusId = await EmployeeRequestsStatusService.validateEmployeeRequestStatus(
      employeeRequestId,
      requestStatusId,
    );

    if (validateEmployeeRequestStatusId) return failureResponse(HttpMessages.requestStatus.invalidRequestStatusId);

    const updateData = {
      employeeRequestFound: employeeRequest,
      requestId: employeeRequestId,
      statusId: requestStatusId,
      approvedBy: userAuthenticatedId,
    };

    const [updatedEmployeeRequest] = await EmployeeRequestService.updateEmployeeRequests(updateData);

    return handleHttpResponse(
      HttpResponse.success(HttpMessages.employeeRequests.updatedSuccess, updatedEmployeeRequest),
    );
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack });

    return handleHttpResponse(
      HttpResponse.internalServerError(HttpMessages.error.internalServerError, {
        error: HttpMessages.error.internalServerError,
      }),
    );
  }
}
