import { NextRequest } from "next/server";
import { UserDeactivateSchema } from "@/schemas/user";
import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { validateRequest } from "@/common/request/validateRequest";
import { UserService } from "@/app/api/services/user.service";
import { HttpMessages } from "@/common/response/messages";
import { IUserDeactivate } from "@/app/api/users/interface";

export async function POST(request: NextRequest) {
  const validationRequest = await validateRequest<IUserDeactivate>(request, UserDeactivateSchema);
  if (validationRequest.response) return validationRequest.response;

  const body = validationRequest.data;

  if (!body) {
    const response = HttpResponse.failure(HttpMessages.error.invalidRequest, {});
    return handleHttpResponse(response);
  }

  try {
    const existingUser = await UserService.getUserById(body.user_id);

    if (!existingUser) {
      return handleHttpResponse(
        HttpResponse.failure(
          HttpMessages.user.notFoundById,
          {
            user_id: body.user_id,
          },
          404,
        ),
      );
    }

    if (!existingUser.active) {
      return handleHttpResponse(
        HttpResponse.failure(
          HttpMessages.user.alreadyDeactivated,
          {
            user_id: body.user_id,
          },
          400,
        ),
      );
    }

    const data = await UserService.deactivateUser(body.user_id);
    const response = HttpResponse.success(HttpMessages.user.deactivatedSuccess, {
      user: {
        id: data.id,
        uuid: data.uuid,
        username: data.username,
        active: data.active,
        updated_at: data.updated_at,
      },
    });
    return handleHttpResponse(response);
  } catch (error: any) {
    console.log(error);

    const response = HttpResponse.internalServerError(HttpMessages.error.internalServerError, { error: error.message });

    return handleHttpResponse(response);
  }
}
