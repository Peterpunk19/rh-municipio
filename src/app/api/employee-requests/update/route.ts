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
import { CatalogsService } from "@/app/api/services/catalogs.service";
import { EmployeeRequestsStatusService } from "@/app/api/services/employee-requests-status.service";
import { RequestsStatusService } from "@/app/api/services/requests-status.service";
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

    const isAllowedToUpdate = await RequestsStatusService.getRequestStatusById(requestStatusId);

    if (!isAllowedToUpdate) return failureResponse(HttpMessages.requestStatus.idNotFound);

    const rolesArray = isAllowedToUpdate.allowed_roles_to_update.split(",").map(Number);

    if (!rolesArray.includes(userAuthenticatedRoleId)) {
      return failureResponse(HttpMessages.employeeRequests.notAllowedToUpdate);
    }

    const employeeRequest = await EmployeeRequestService.getEmployeeRequestById(employeeRequestId);

    if (!employeeRequest) return failureResponse(HttpMessages.employeeRequests.notFoundById);

    if (requestStatusId === REQUEST_STATUS_ID.CANCELADA && employeeRequest.requestedBy.id !== userAuthenticatedId) {
      return failureResponse(HttpMessages.employeeRequests.invalidUserToCancel);
    }

    if (employeeRequest.request_status.id === requestStatusId)
      return failureResponse(HttpMessages.employeeRequests.invalidUpdateData);

    const existingRequestStatusId = await CatalogsService.getCatalogById("requestStatus", requestStatusId);

    if (!existingRequestStatusId) return failureResponse(HttpMessages.requestStatus.idNotFound);

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
