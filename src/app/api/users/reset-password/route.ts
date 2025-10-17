import { NextRequest, NextResponse } from "next/server";
import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { validateRequest } from "@/common/request/validateRequest";
import { UserService } from "@/app/api/services/user.service";
import { HttpMessages } from "@/common/response/messages";
import { authMiddleware } from "@/middleware/authMiddleware";
import { ROLES, ROLES_ID_VALUES } from "@/common/constants/Roles";
import { logger } from "@/lib/logger";
import { UserResetPasswordSchema } from "@/schemas/user";
import { SYSTEM_LOG_ACTIONS } from "@/common/constants/SystemLogActions";

interface IResetPasswordRequest {
  userId: number;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const authResponse = await authMiddleware();
    if (authResponse instanceof NextResponse) {
      return authResponse;
    }

    if (authResponse.roleId !== ROLES_ID_VALUES[ROLES.ADMIN]) {
      const response = HttpResponse.failure(HttpMessages.user.resetPasswordUnauthorized, {}, 403);
      return handleHttpResponse(response);
    }

    const validationRequest = await validateRequest<IResetPasswordRequest>(request, UserResetPasswordSchema);
    if (validationRequest.response) return validationRequest.response;

    const body = validationRequest.data;
    if (!body) {
      const response = HttpResponse.failure(HttpMessages.error.invalidRequest, {});
      return handleHttpResponse(response);
    }

    const targetUser = await UserService.getUserById(body.userId);
    if (!targetUser) {
      const response = HttpResponse.failure(HttpMessages.user.resetPasswordUserNotFound, { userId: body.userId }, 404);
      return handleHttpResponse(response);
    }

    if (targetUser.role_id === ROLES_ID_VALUES[ROLES.ADMIN]) {
      const response = HttpResponse.failure(HttpMessages.user.resetPasswordCannotAdmin, { userId: body.userId }, 403);
      return handleHttpResponse(response);
    }

    const resetResult = await UserService.resetUserPassword(body.userId, authResponse.userId, body.password);

    if (!resetResult.success) {
      const response = HttpResponse.failure(
        resetResult.message || HttpMessages.user.resetPasswordServiceError,
        {},
        500,
      );
      return handleHttpResponse(response);
    }

    logger.info("Password reset by administrator", {
      adminUserId: authResponse.userId,
      targetUserId: body.userId,
      timestamp: new Date().toISOString(),
      action: SYSTEM_LOG_ACTIONS.PASSWORD_RESET,
    });

    const response = HttpResponse.success(HttpMessages.user.resetPasswordSuccess, {
      userId: body.userId,
      username: targetUser.username,
      mustChangePassword: true,
    });
    return handleHttpResponse(response);
  } catch (error: any) {
    logger.error("Error resetting user password", {
      error: error.message,
      stack: error.stack,
    });

    const response = HttpResponse.internalServerError("Error interno del servidor al resetear la contraseña", {
      error: error.message,
    });
    return handleHttpResponse(response);
  }
}
