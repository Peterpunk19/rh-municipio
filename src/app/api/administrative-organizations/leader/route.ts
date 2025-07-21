import { NextRequest, NextResponse } from "next/server";
import { CreateUpdateLeaderSchema, LeadersGetFilterSchema } from "@/schemas/administrative-organization-leaders";
import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { validateRequest, validateRequestByUrlParams } from "@/common/request/validateRequest";
import { EmployeeService } from "@/app/api/services/employee.service";
import { DireccionService } from "@/app/api/services/direccion.service";
import { AdministrativeOrganizationLeadersService } from "@/app/api/services/administrative-organization-leaders.service";
import { HttpMessages } from "@/common/response/messages";
import { ICreateUpdateLeader, ILeadersFilters } from "@/app/api/administrative-organizations/types";
import { logger } from "@/lib/logger";
import { ROLES } from "@/common/constants/Roles";
import { RoleService } from "@/app/api/services/role.service";
import { authMiddleware } from "@/middleware/authMiddleware";
import { getParamsFromUrl } from "@/common/utils";

export async function POST(request: NextRequest) {
  const authResponse = await authMiddleware();
  if (authResponse instanceof NextResponse) {
    return authResponse;
  }

  const validationRequest = await validateRequest<ICreateUpdateLeader>(request, CreateUpdateLeaderSchema);
  if (validationRequest.response) return validationRequest.response;

  const body = validationRequest.data;

  if (!body) {
    const response = HttpResponse.failure(HttpMessages.error.invalidRequest, {});
    return handleHttpResponse(response);
  }

  body.createdById = authResponse.userId;

  try {
    const [directorRole, deputyDirectorRole] = await Promise.all([
      RoleService.getRoleByName(ROLES.DIRECTOR),
      RoleService.getRoleByName(ROLES.SUPLENTE),
    ]);

    if (!directorRole) {
      return handleHttpResponse(HttpResponse.failure(HttpMessages.role.notFound, { role: ROLES.DIRECTOR }, 404));
    }

    if (body.deputyDirector && !deputyDirectorRole) {
      return handleHttpResponse(HttpResponse.failure(HttpMessages.role.notFound, { role: ROLES.SUPLENTE }, 404));
    }

    const [existingDirector, existingDireccion, existingDeputyDirector] = await Promise.all([
      EmployeeService.getEmployeeById(body.director),
      DireccionService.getDireccionById(body.direccionId),
      body.deputyDirector ? EmployeeService.getEmployeeById(body.deputyDirector) : Promise.resolve(null),
    ]);

    if (!existingDireccion) {
      return handleHttpResponse(
        HttpResponse.failure(
          HttpMessages.administrativeOrganizations.notFoundByDireccionId,
          {
            direccionId: body.direccionId,
          },
          404,
        ),
      );
    }

    if (!existingDirector) {
      return handleHttpResponse(
        HttpResponse.failure(
          HttpMessages.administrativeOrganizations.notFoundByDirectorId,
          {
            director: body.director,
          },
          404,
        ),
      );
    }

    if (!existingDeputyDirector && body.deputyDirector) {
      return handleHttpResponse(
        HttpResponse.failure(
          HttpMessages.administrativeOrganizations.notFoundByDeputyDirectorId,
          {
            deputyDirector: body.deputyDirector,
          },
          404,
        ),
      );
    }

    const directorData = {
      direccionId: body.direccionId,
      employeeId: body.director,
      roleId: directorRole.id,
      startDate: body.startDate,
      endDate: body.endDate,
      createdById: body.createdById,
    };
    const directorLeader = await AdministrativeOrganizationLeadersService.createLeader(directorData);
    let deputyDirectorLeader = null;

    if (body.deputyDirector) {
      const deputyDirectorData = {
        direccionId: body.direccionId,
        employeeId: body.deputyDirector,
        roleId: deputyDirectorRole!.id,
        startDate: body.startDate,
        endDate: body.endDate,
        createdById: body.createdById,
      };
      deputyDirectorLeader = await AdministrativeOrganizationLeadersService.createLeader(deputyDirectorData);
    } else {
      await AdministrativeOrganizationLeadersService.deactivateLeader(
        body.direccionId,
        deputyDirectorRole!.id,
        body.createdById,
      );
    }

    const response = HttpResponse.success(HttpMessages.administrativeOrganizations.leadersCreatedSuccess, {
      director: directorLeader,
      ...(deputyDirectorLeader && { deputyDirector: deputyDirectorLeader }),
    });
    return handleHttpResponse(response);
  } catch (error: any) {
    logger.error("Failed to create leaders");
    logger.error(error.message);

    const response = HttpResponse.internalServerError(HttpMessages.error.internalServerError, {});

    return handleHttpResponse(response);
  }
}

export async function GET(request: Request) {
  try {
    const params = {
      page: 1,
      limit: 5,
      active: null,
      search: null,
      startDate: null,
      endDate: null,
      direccionId: null,
      roleId: null,
    };

    const requestParams = await getParamsFromUrl(request, params);

    const authData = await authMiddleware();
    if (authData instanceof NextResponse) {
      return authData;
    }
    const validationRequest = await validateRequestByUrlParams<ILeadersFilters>(requestParams, LeadersGetFilterSchema);
    if (validationRequest.response) return validationRequest.response;

    const validRequestData = validationRequest.data;

    if (!validRequestData) {
      const response = HttpResponse.failure(HttpMessages.error.validationFields, {});
      return handleHttpResponse(response);
    }

    const leaders = await AdministrativeOrganizationLeadersService.getLeadersByParams(validRequestData);

    if (leaders && leaders.total === 0) {
      const response = HttpResponse.success(HttpMessages.administrativeOrganizations.leadersNotFound, {
        leaders: [],
        total: 0,
        totalPages: 0,
        currentPage: 1,
      });

      return handleHttpResponse(response);
    }

    const response = HttpResponse.success(HttpMessages.administrativeOrganizations.leadersGetSuccess, leaders);
    return handleHttpResponse(response);
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack });

    const response = HttpResponse.failure(HttpMessages.error.internalServerError, error);
    return handleHttpResponse(response);
  }
}
