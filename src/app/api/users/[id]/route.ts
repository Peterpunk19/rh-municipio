import { handleHttpResponse } from "@/common/response/handler";
import { UserGetByIdSchema } from "@/schemas/user";
import type { IUserById } from "@/app/api/users/interface";
import { validateRequestByUrlParams } from "@/common/request/validateRequest";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import { UserService } from "@/app/api/services/user.service";
import { StatusCodes } from "http-status-codes";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = Number.parseInt((await params).id);
    const requestParams = {
      id,
    };
    const validationRequest = await validateRequestByUrlParams<IUserById>(requestParams, UserGetByIdSchema);
    if (validationRequest.response) return validationRequest.response;
    const validRequestData = validationRequest.data;

    if (!validRequestData) {
      const response = HttpResponse.failure(HttpMessages.error.invalidRequest, {});
      return handleHttpResponse(response);
    }

    const existingUser = await UserService.getUserById(validRequestData.id);
    if (!existingUser) {
      const response = HttpResponse.failure(HttpMessages.user.notFoundById, {}, StatusCodes.NOT_FOUND);
      return handleHttpResponse(response);
    }

    const response = HttpResponse.success(HttpMessages.user.foundById, existingUser);
    return handleHttpResponse(response);
  } catch (error) {
    console.error(`An error occurred detail: ${error}`);
    const response = HttpResponse.failure(HttpMessages.error.internalServerError, error);
    return handleHttpResponse(response);
  }
}
