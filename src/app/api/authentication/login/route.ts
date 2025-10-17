import { LoginSchema } from "@/schemas/authentication";
import { UserGetSchema } from "@/schemas/user";
import type { IUser } from "@/app/api/users/interface";
import { HttpMessages } from "@/common/response/messages";
import { HttpResponse } from "@/common/response/model";
import { handleHttpResponse } from "@/common/response/handler";
import { StatusCodes } from "http-status-codes";
import { UserService } from "@/app/api/services/user.service";
import { validateRequest } from "@/common/request/validateRequest";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";
import { RoleModuleService } from "@/app/api/services/role-module.service";
import { generateMenuItems } from "@/utils/menu-generator";

export async function POST(request: NextRequest) {
  try {
    const validatedRequest = await validateRequest<IUser>(request, LoginSchema);

    if (validatedRequest.response) return validatedRequest.response;
    const body = validatedRequest.data;

    if (!body) {
      const response = HttpResponse.failure(HttpMessages.error.invalidRequest, {});
      return handleHttpResponse(response);
    }

    const { username, password } = body;
    const user = await UserService.getUserByUsername(username);
    if (!user) {
      const response = HttpResponse.failure(HttpMessages.user.wrongUsername, {}, StatusCodes.NOT_FOUND);
      return handleHttpResponse(response);
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      const response = HttpResponse.failure(HttpMessages.user.wrongPassword, {}, StatusCodes.UNAUTHORIZED);
      return handleHttpResponse(response);
    }
    const validatedUser = UserGetSchema.parse(user);

    const roleModules = await RoleModuleService.gerRoleModulesByIdRole(Number(validatedUser.role_id));

    const menuItems = generateMenuItems(roleModules);

    const token = jwt.sign(
      {
        id: validatedUser.id,
        username: validatedUser.username,
        role_id: validatedUser.role_id,
      },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: Number.parseInt(process.env.JWT_ACCESS_EXPIRES_IN!, 10) },
    );

    const response = HttpResponse.success(HttpMessages.user.loginSuccess, {
      payload: {
        ...validatedUser,
        menuItems,
      },
      token,
    });
    return handleHttpResponse(response);
  } catch (error) {
    const response = HttpResponse.internalServerError(HttpMessages.error.internalServerError, { error: error });
    return handleHttpResponse(response);
  }
}
