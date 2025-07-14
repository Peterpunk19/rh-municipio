import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import { EmployeeService } from "@/app/api/services/employee.service";
import { authMiddleware } from "@/middleware/authMiddleware";
import { NextResponse } from "next/server";
import { UserService } from "@/app/api/services/user.service";
import { ROLES } from "@/common/constants/Roles";
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.has("search") ? searchParams.get("search") : null;

    const authData = await authMiddleware();
    if (authData instanceof NextResponse) {
      return authData;
    }

    const { userId, roleName } = authData;
    let isEnlace = false;

    if (roleName === ROLES.ENLACE || roleName === ROLES.SUBENLACE) {
      isEnlace = true;
    }

    let response = HttpResponse.success(HttpMessages.error.notFound, {});

    if (search) {
      let existingEmployees;
      let direccionIds;
      if (isEnlace) {
        const direcciones = await UserService.getActiveUserDirecciones(userId);
        direccionIds = direcciones.map((d: any) => d.direccion.id);
      }
      existingEmployees = await EmployeeService.getEmployeesAutocomplete(search, direccionIds);

      response = HttpResponse.success(HttpMessages.catalog.success, existingEmployees);
    }

    return handleHttpResponse(response);
  } catch (error) {
    logger.error(`An error occurred detail: ${error}`);
    const response = HttpResponse.failure(HttpMessages.error.internalServerError, error);
    return handleHttpResponse(response);
  }
}
