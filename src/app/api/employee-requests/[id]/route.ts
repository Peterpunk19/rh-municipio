import { handleHttpResponse } from "@/common/response/handler";
import { EmployeeGetByIdSchema } from "@/schemas/employee";
import type { IEmployeeById } from "@/app/api/employees/interface";
import { validateRequestByUrlParams } from "@/common/request/validateRequest";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import { EmployeeRequestService } from "@/app/api/services/employee-request.service";
import { failureResponse, successResponse } from "@/common/utils";
import { logger } from "@/lib/logger";
import { authMiddleware } from "@/middleware/authMiddleware";
import { validateRequestsRolesPermissions } from "@/app/api/common/utils.service";
import { REQUESTS_ROLES_PERMISSIONS } from "@/common/constants/RequestsRolesPermissions";
import { NextResponse } from "next/server";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authData = await authMiddleware();
    if (authData instanceof NextResponse) {
      return authData;
    }

    const { roleId } = authData;

    const id = Number.parseInt((await params).id);
    if (isNaN(id)) return failureResponse(HttpMessages.error.invalidId);

    const validationRequest = await validateRequestByUrlParams<IEmployeeById>({ id }, EmployeeGetByIdSchema);
    if (validationRequest.response) return validationRequest.response;

    const existingEmployeeRequest = await EmployeeRequestService.getEmployeeRequestById(id);
    if (!existingEmployeeRequest) return failureResponse(HttpMessages.employeeRequests.notFoundById);

    // Validate if user has permission to view this request
    const permissionValidation = await validateRequestsRolesPermissions(
      roleId,
      existingEmployeeRequest.request.id,
      REQUESTS_ROLES_PERMISSIONS.CAN_VIEW,
    );

    if (!permissionValidation) {
      return failureResponse("No tienes permisos para ver esta solicitud.");
    }

    return successResponse(HttpMessages.employeeRequests.foundById, existingEmployeeRequest);
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack });

    return handleHttpResponse(
      HttpResponse.internalServerError(HttpMessages.error.internalServerError, {
        error: HttpMessages.error.internalServerError,
      }),
    );
  }
}
