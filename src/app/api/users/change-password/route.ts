import { type NextRequest, NextResponse } from "next/server";
import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { validateRequest } from "@/common/request/validateRequest";
import { UserService } from "@/app/api/services/user.service";
import { HttpMessages } from "@/common/response/messages";
import { authMiddleware } from "@/middleware/authMiddleware";
import { UserChangePasswordSchema } from "@/schemas/user";
import { logger } from "@/lib/logger";
import { SYSTEM_LOG_ACTIONS } from "@/common/constants/SystemLogActions";

interface IChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export async function POST(request: NextRequest) {
  try {
    // Validar autenticación
    const authResponse = await authMiddleware();
    if (authResponse instanceof NextResponse) {
      return authResponse;
    }

    // Validar request
    const validationRequest = await validateRequest<IChangePasswordRequest>(request, UserChangePasswordSchema);
    if (validationRequest.response) return validationRequest.response;

    const body = validationRequest.data;
    if (!body) {
      const response = HttpResponse.failure(HttpMessages.error.invalidRequest, {});
      return handleHttpResponse(response);
    }

    // Llamar al servicio para cambiar la contraseña
    const changeResult = await UserService.changeUserPassword(
      authResponse.userId,
      body.currentPassword,
      body.newPassword,
    );

    if (!changeResult.success) {
      const statusCode = changeResult.message === "La contraseña actual es incorrecta" ? 401 : 400;
      const response = HttpResponse.failure(
        changeResult.message || HttpMessages.user.changePasswordServiceError,
        {},
        statusCode,
      );
      return handleHttpResponse(response);
    }

    // Log de éxito
    logger.info(
      `Password changed by user ${authResponse.userId} at ${new Date().toISOString()} - Action: ${SYSTEM_LOG_ACTIONS.PASSWORD_CHANGE}`,
    );

    // Obtener información del usuario
    const user = await UserService.getUserById(authResponse.userId);

    const response = HttpResponse.success(HttpMessages.user.changePasswordSuccess, {
      userId: authResponse.userId,
      username: user?.username,
      mustChangePassword: false,
    });
    return handleHttpResponse(response);
  } catch (error: any) {
    logger.error(
      `Error changing user password: ${error.message} - Stack: ${error.stack} - Timestamp: ${new Date().toISOString()}`,
    );

    const response = HttpResponse.internalServerError("Error interno del servidor al cambiar la contraseña", {
      error: error.message,
    });
    return handleHttpResponse(response);
  }
}
