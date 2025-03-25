import { signIn, auth } from "@/auth";
import { LoginSchema } from "@/schemas/authentication";
import { HttpMessages } from "@/common/response/messages";
import { HttpResponse } from "@/common/response/model";
import { handleHttpResponse } from "@/common/response/handler";
import { StatusCodes } from "http-status-codes";
import type { NextRequest } from "next/server";
import { validateRequest } from "@/common/request/validateRequest";
import type { IUser } from "@/app/api/users/interface";

export async function POST(request: NextRequest) {
  try {
    const validatedRequest = await validateRequest<IUser>(request, LoginSchema);

    if (validatedRequest.response) return validatedRequest.response;
    const body = validatedRequest.data;

    if (!body) {
      const response = HttpResponse.failure(HttpMessages.error.invalidRequest, {});
      return handleHttpResponse(response);
    }

    if (!body.username || !body.password) {
      const response = HttpResponse.failure(HttpMessages.user.missingParamsLogin, {});
      return handleHttpResponse(response);
    }

    const { username, password } = body;
    await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    const session = await auth();
    const response = HttpResponse.success(HttpMessages.user.loginSuccess, session);
    return handleHttpResponse(response);
  } catch (error) {
    if (error?.type === "CredentialsSignin") {
      const response = HttpResponse.failure(HttpMessages.user.invalidLogin, {}, StatusCodes.UNAUTHORIZED);
      return handleHttpResponse(response);
    }
    const response = HttpResponse.internalServerError(HttpMessages.error.internalServerError, { error: error });

    return handleHttpResponse(response);
  }
}
