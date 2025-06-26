import { NextRequest } from "next/server";
import { UserPostSchema } from "@/schemas/user";
import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { validateRequest } from "@/common/request/validateRequest";
import { UserService } from "@/app/api/services/user.service";
import { RoleService } from "@/app/api/services/role.service";
import { EmployeeService } from "@/app/api/services/employee.service";
import { HttpMessages } from "@/common/response/messages";
import { IUser } from "@/app/api/users/interface";
import { isRoleExcluded, ROLES } from "@/common/constants/Roles";
import { CatalogsService } from "../../services/catalogs.service";
import { authMiddleware } from "@/middleware/authMiddleware";
import { NextResponse } from "next/server";
import { AdministrativeOrganizationLeadersService } from "../../services/administrative-organization-leaders.service";

export async function POST(request: NextRequest) {
  const authResponse = await authMiddleware();
  if (authResponse instanceof NextResponse) {
    return authResponse;
  }

  const validationRequest = await validateRequest<IUser>(request, UserPostSchema);
  if (validationRequest.response) return validationRequest.response;

  const body = validationRequest.data;
  if (!body) {
    const response = HttpResponse.failure(HttpMessages.error.invalidRequest, {});
    return handleHttpResponse(response);
  }

  body.created_by_id = authResponse.userId;

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

    if (existingRole && isRoleExcluded(existingRole.name, "USER_CREATION")) {
      const response = HttpResponse.failure(HttpMessages.error.validationFields, {
        role_id: {
          messages: [HttpMessages.role.notAllowed],
        },
      });
      return handleHttpResponse(response);
    }

    const isEnlaceOrSubenlace = existingRole.name === ROLES.ENLACE || existingRole.name === ROLES.SUBENLACE;

    if (isEnlaceOrSubenlace) {
      const existingSecretaria = await CatalogsService.getCatalogById("secretaria", body.secretaria_id!);

      if (!existingSecretaria) {
        const response = HttpResponse.failure(HttpMessages.administrativeOrganizations.secretariaNotFound, {
          secretaria_id: body.secretaria_id,
        });
        return handleHttpResponse(response);
      }

      const direccionesBySecretaria = await CatalogsService.getDirecciones(body.secretaria_id!);
      const direccionesIds = direccionesBySecretaria.map((dir) => dir.id);

      const direccionesInvalidas = body.direcciones_ids?.filter((id) => !direccionesIds.includes(id));

      if (direccionesInvalidas?.length) {
        const response = HttpResponse.failure(HttpMessages.administrativeOrganizations.direccionesNotFound, {
          direcciones_invalidas: direccionesInvalidas,
        });
        return handleHttpResponse(response);
      }
    } else {
      body.secretaria_id = undefined;
      body.direcciones_ids = [];
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
    const response = HttpResponse.internalServerError(HttpMessages.error.internalServerError, { error: error.message });
    return handleHttpResponse(response);
  }
}
