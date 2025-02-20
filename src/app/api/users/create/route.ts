import { NextRequest } from "next/server";
import { UserSchema } from "@/schemas/user";
import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { validateRequest } from "@/common/request/validateRequest";
import { UserService } from "@/app/api/services/user.service";
import { RoleService } from "@/app/api/services/role.service";
import { EmployeeService } from "@/app/api/services/employee.service";
import { HttpMessages } from "@/common/response/messages";
import { IUser } from "@/app/api/users/interface";

export async function POST(request: NextRequest) {
  const validationRequest = await validateRequest<IUser>(request, UserSchema);
  if (validationRequest.response) return validationRequest.response;

  const body = validationRequest.data;

  if (!body) {
    const response = HttpResponse.failure(HttpMessages.error.invalidRequest, {});
    return handleHttpResponse(response);
  }

  try {
    const existingUsername = await UserService.getUserByUsername(body.username);

    if (existingUsername) {
      const response = HttpResponse.failure(
        HttpMessages.user.usernameAlreadyExists,
        {
          username: body.username,
        },
        409,
      );
      return handleHttpResponse(response);
    }

    if (body.uuid) {
      const existingUuid = await UserService.getUserByUuid(body.uuid);

      if (existingUuid) {
        const response = HttpResponse.failure(
          HttpMessages.user.uuidAlreadyExists,
          {
            uuid: body.uuid,
          },
          409,
        );
        return handleHttpResponse(response);
      }
    }

    if (body.employee_id) {
      const existingEmployeeId = await UserService.getUserByEmployeeId(body.employee_id);

      if (existingEmployeeId) {
        const response = HttpResponse.failure(HttpMessages.user.employeeIdAlreadyExists, {
          employee_id: body.employee_id,
        });
        return handleHttpResponse(response);
      }

      const existingEmployee = await EmployeeService.getEmployeeById(body.employee_id);

      if (!existingEmployee) {
        const response = HttpResponse.failure(HttpMessages.error.validationFields, {
          employee_id: {
            messages: [HttpMessages.employee.notFound],
          },
        });
        return handleHttpResponse(response);
      }
    }

    const existingRole = await RoleService.getRoleById(body.role_id);

    if (!existingRole) {
      const response = HttpResponse.failure(HttpMessages.role.notFound, {
        role_id: body.role_id,
      });
      return handleHttpResponse(response);
    }

    const user = await UserService.createUser(body);
    const response = HttpResponse.success(HttpMessages.user.createdSuccess, {
      id: user.id,
      uuid: user.uuid,
      username: user.username,
      role_id: user.role_id,
      active: user.active,
      created_at: user.created_at,
    });

    return handleHttpResponse(response);
  } catch (error: any) {
    console.log(error);

    const response = HttpResponse.internalServerError(HttpMessages.error.internalServerError, { error: error.message });

    return handleHttpResponse(response);
  }
}
