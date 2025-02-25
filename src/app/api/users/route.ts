import { handleHttpResponse } from "@/common/response/handler";
import { UserGetByFilterSchema } from "@/schemas/user";
import type { IUserFilters } from "@/app/api/users/interface";
import { validateRequestByUrlParams } from "@/common/request/validateRequest";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import { UserService } from "@/app/api/services/user.service";

const DEFAULT_LIMIT = 20;
const DEFAULT_PAGE = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number.parseInt(searchParams.get("limit") || (DEFAULT_LIMIT.toString() as string), 10);
    const page = Number.parseInt(searchParams.get("page") || (DEFAULT_PAGE.toString() as string), 10);
    const active = searchParams.has("active") ? searchParams.get("active") : true;
    const role_id = searchParams.has("role_id") ? Number.parseInt(searchParams.get("role_id")!, 10) : null;
    const requestParams = {
      limit,
      page,
      active,
      role_id,
    };
    const validationRequest = await validateRequestByUrlParams<IUserFilters>(requestParams, UserGetByFilterSchema);
    if (validationRequest.response) return validationRequest.response;

    const validRequestData = validationRequest.data;

    if (!validRequestData) {
      const response = HttpResponse.failure(HttpMessages.error.validationFields, {});
      return handleHttpResponse(response);
    }
    const existingUsers = await UserService.getUsersByParams(validRequestData);

    if (existingUsers && existingUsers.total === 0) {
      const response = HttpResponse.success(HttpMessages.user.notFound, {
        total: 0,
        totalPages: 0,
        currentPage: 1,
        users: [],
      });
      return handleHttpResponse(response);
    }
    const response = HttpResponse.success(HttpMessages.user.getSuccess, existingUsers);
    return handleHttpResponse(response);
  } catch (error) {
    const response = HttpResponse.failure(HttpMessages.error.internalServerError, error);
    return handleHttpResponse(response);
  }
}
