import { handleHttpResponse } from "@/common/response/handler";
import { EmployeeGetByIdSchema } from "@/schemas/employee";
import type { IEmployeeById } from "@/app/api/employees/interface";
import { validateRequestByUrlParams } from "@/common/request/validateRequest";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import { EmployeeRequestService } from "@/app/api/services/employee-request.service";
import { failureResponse, successResponse } from "@/common/utils";
import { logger } from "@/lib/logger";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = Number.parseInt((await params).id);
    if (isNaN(id)) return failureResponse(HttpMessages.error.invalidId);

    const validationRequest = await validateRequestByUrlParams<IEmployeeById>({ id }, EmployeeGetByIdSchema);
    if (validationRequest.response) return validationRequest.response;

    const existingEmployeeRequest = await EmployeeRequestService.getEmployeeRequestById(id);
    if (!existingEmployeeRequest) return failureResponse(HttpMessages.employeeRequests.notFoundById);

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
