import { NextRequest, NextResponse } from "next/server";
import { UserDeactivateSchema } from "@/schemas/user";
import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { validateRequest } from "@/common/request/validateRequest";
import { UserService } from "@/app/api/services/user.service";
import { HttpMessages } from "@/common/response/messages";
import { IUserDeactivate } from "@/app/api/users/interface";
import { authMiddleware } from "@/middleware/authMiddleware";
import { logger } from "@/lib/logger";
import { SYSTEM_LOG_ACTIONS } from "@/common/constants/SystemLogActions";

export async function POST(request: NextRequest) {
  const authResponse = await authMiddleware();
  if (authResponse instanceof NextResponse) {
    return authResponse;
  }

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

    const newActiveStatus = !existingUser.active;
    const actionType = newActiveStatus ? SYSTEM_LOG_ACTIONS.ACTIVATE_USER : SYSTEM_LOG_ACTIONS.DEACTIVATE_USER;
    const actionDescription = newActiveStatus ? "activó" : "desactivó";

    const data = await UserService.changeStatusUser(
      body.user_id,
      newActiveStatus,
      authResponse.userId,
      existingUser.username,
    );

    logger.info(
      {
        adminUserId: authResponse.userId,
        targetUserId: body.user_id,
        targetUsername: existingUser.username,
        previousStatus: existingUser.active,
        newStatus: newActiveStatus,
        action: actionType,
        timestamp: new Date().toISOString(),
      },
      `User ${actionDescription} by administrator`,
    );

    const message = existingUser.active ? HttpMessages.user.deactivatedSuccess : HttpMessages.user.activatedSuccess;
    const response = HttpResponse.success(message, {
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
    logger.error(
      {
        error: error.message,
        stack: error.stack,
        userId: body.user_id,
      },
      "Error changing user status",
    );

    const response = HttpResponse.internalServerError(HttpMessages.error.internalServerError, { error: error.message });

    return handleHttpResponse(response);
  }
}
