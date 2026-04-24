import { NextRequest, NextResponse } from "next/server";
import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { validateRequest } from "@/common/request/validateRequest";
import { HttpMessages } from "@/common/response/messages";
import { authMiddleware } from "@/middleware/authMiddleware";
import { logger } from "@/lib/logger";
import { EmployeeHiringPostSchema } from "@/schemas/employee-hiring";
import { EmployeeHiringService } from "@/app/api/services/employee-hiring-service";
import { ICreateEmployeeHiring } from "@/app/api/employee-hiring/create/interface";

export async function POST(request: NextRequest) {
  const authResponse = await authMiddleware();

  if (authResponse instanceof NextResponse) {
    return authResponse;
  }

  const validationRequest = await validateRequest<ICreateEmployeeHiring>(request, EmployeeHiringPostSchema);

  if (validationRequest.response) return validationRequest.response;

  const body = validationRequest.data;

  if (!body) {
    return handleHttpResponse(HttpResponse.failure(HttpMessages.error.invalidRequest, {}));
  }

  try {
    const result = await EmployeeHiringService.createEmployeeHiring({
      employeeId: Number(body.employeeId),
      startJobDate: new Date(body.startJobDate),
      endJobDate: body.endJobDate ? new Date(body.endJobDate) : null,
      categoryId: Number(body.categoryId),
      employeeTypeId: Number(body.employeeTypeId),
      direccionId: Number(body.direccionId),
      userId: Number(authResponse.userId ?? authResponse.user?.id),
    });

    return handleHttpResponse(HttpResponse.success("Contrato creado correctamente", result));
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack });

    return handleHttpResponse(
      HttpResponse.internalServerError(error.message || HttpMessages.error.internalServerError, {
        error: error.message,
      }),
    );
  }
}
