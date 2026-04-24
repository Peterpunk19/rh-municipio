import { NextRequest, NextResponse } from "next/server";
import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { validateRequest } from "@/common/request/validateRequest";
import { HttpMessages } from "@/common/response/messages";
import { authMiddleware } from "@/middleware/authMiddleware";
import { logger } from "@/lib/logger";
import { EmployeeHiringTerminatePostSchema } from "@/schemas/employee-hiring-terminate";
import { EmployeeHiringService } from "@/app/api/services/employee-hiring-service";
import { ITerminateEmployeeHiring } from "@/app/api/employee-hiring/terminate/interface";

export async function POST(request: NextRequest) {
  const authResponse = await authMiddleware();

  if (authResponse instanceof NextResponse) {
    return authResponse;
  }

  const validationRequest = await validateRequest<ITerminateEmployeeHiring>(request, EmployeeHiringTerminatePostSchema);

  if (validationRequest.response) return validationRequest.response;

  const body = validationRequest.data;

  if (!body) {
    return handleHttpResponse(HttpResponse.failure(HttpMessages.error.invalidRequest, {}));
  }

  try {
    const result = await EmployeeHiringService.terminateEmployeeHiring({
      employeeHiringId: Number(body.employeeHiringId),
      terminationDate: new Date(body.terminationDate),
      reason: body.reason,
      comments: body.comments,
      userId: Number(authResponse.userId ?? authResponse.user?.id),
    });

    return handleHttpResponse(HttpResponse.success("Contrato terminado correctamente", result));
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack });

    return handleHttpResponse(
      HttpResponse.internalServerError(error.message || HttpMessages.error.internalServerError, {
        error: error.message,
      }),
    );
  }
}
