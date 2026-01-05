import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import { authMiddleware } from "@/middleware/authMiddleware";
import { validateRequest } from "@/common/request/validateRequest";
import { CatalogCreateConfig } from "@/interfaces/Catalogs";
import { NextResponse } from "next/server";

export async function handleCatalogCreate<T = any>({
  request,
  createSchema,
  serviceMethod,
  message,
}: CatalogCreateConfig<T>) {
  try {
    const authData = await authMiddleware();

    if (authData instanceof NextResponse) {
      return authData;
    }

    const validationRequest = await validateRequest<T>(request, createSchema);

    if (validationRequest.response) return validationRequest.response;

    if (!validationRequest.data) {
      const response = HttpResponse.failure(HttpMessages.error.validationFields, {});
      return handleHttpResponse(response);
    }

    const createdRecord = await serviceMethod(validationRequest.data);

    const response = HttpResponse.success(message.createdSuccess, createdRecord);

    return handleHttpResponse(response);
  } catch (error: any) {
    const response = HttpResponse.internalServerError(error.message || HttpMessages.error.internalServerError, {});

    return handleHttpResponse(response);
  }
}
