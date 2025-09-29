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
    const [directorRole, secretaryRole, coordinatorRole, immediateResponsibleRole] = await Promise.all([
      RoleService.getRoleByName(ROLES.DIRECTOR),
      RoleService.getRoleByName(ROLES.SECRETARIO),
      RoleService.getRoleByName(ROLES.COORDINADOR),
      RoleService.getRoleByName(ROLES.RESPONSABLE_INMEDIATO),
    ]);

    if (!directorRole) {
      return handleHttpResponse(HttpResponse.failure(HttpMessages.role.notFound, { role: ROLES.DIRECTOR }, 404));
    }

    const employeeRoles: Record<number, number> = {} as Record<number, number>;
    if (body.director) {
      employeeRoles[body.director] = directorRole.id;
    }

    if (body.secretary) {
      if (!secretaryRole) {
        return handleHttpResponse(HttpResponse.failure(HttpMessages.role.notFound, { role: ROLES.SECRETARIO }, 404));
      }
      employeeRoles[body.secretary] = secretaryRole.id;
    }

    if (body.coordinator) {
      if (!coordinatorRole) {
        return handleHttpResponse(HttpResponse.failure(HttpMessages.role.notFound, { role: ROLES.COORDINADOR }, 404));
      }
      employeeRoles[body.coordinator] = coordinatorRole.id;
    }

    if (body.immediateResponsible) {
      if (!immediateResponsibleRole) {
        return handleHttpResponse(
          HttpResponse.failure(HttpMessages.role.notFound, { role: ROLES.RESPONSABLE_INMEDIATO }, 404),
        );
      }
      employeeRoles[body.immediateResponsible] = immediateResponsibleRole.id;
    }

    if (body.signIncidentsRole && !Object.values(employeeRoles).includes(body.signIncidentsRole)) {
      return handleHttpResponse(
        HttpResponse.failure(
          HttpMessages.administrativeOrganizations.signIncidentsRoleNotMatch,
          { sign_incidents_role: body.signIncidentsRole },
          400,
        ),
      );
    }

    if (body.signRequestsRole && !Object.values(employeeRoles).includes(body.signRequestsRole)) {
      return handleHttpResponse(
        HttpResponse.failure(
          HttpMessages.administrativeOrganizations.signRequestsRoleNotMatch,
          { sign_requests_role: body.signRequestsRole },
          400,
        ),
      );
    }

    const [
      existingDirector,
      existingDireccion,
      existingSecretary,
      existingCoordinator,
      existingImmediateResponsible,
      existingSignIncidentsRole,
      existingSignRequestsRole,
    ] = await Promise.all([
      body.director ? EmployeeService.getEmployeeById(body.director) : Promise.resolve(null),
      DireccionService.getDireccionById(body.direccionId),
      body.secretary ? EmployeeService.getEmployeeById(body.secretary) : Promise.resolve(null),
      body.coordinator ? EmployeeService.getEmployeeById(body.coordinator) : Promise.resolve(null),
      body.immediateResponsible ? EmployeeService.getEmployeeById(body.immediateResponsible) : Promise.resolve(null),
      body.signIncidentsRole ? RoleService.getRoleById(body.signIncidentsRole) : Promise.resolve(null),
      body.signRequestsRole ? RoleService.getRoleById(body.signRequestsRole) : Promise.resolve(null),
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

    if (body.director && !existingDirector) {
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

    if (!existingSecretary && body.secretary) {
      return handleHttpResponse(
        HttpResponse.failure(
          HttpMessages.administrativeOrganizations.notFoundSecretaryId,
          {
            secretary: body.secretary,
          },
          404,
        ),
      );
    }

    if (!existingCoordinator && body.coordinator) {
      return handleHttpResponse(
        HttpResponse.failure(
          HttpMessages.administrativeOrganizations.notFoundCoordinatorId,
          {
            coordinator: body.coordinator,
          },
          404,
        ),
      );
    }

    if (!existingImmediateResponsible && body.immediateResponsible) {
      return handleHttpResponse(
        HttpResponse.failure(
          HttpMessages.administrativeOrganizations.notFoundImmediateResponsibleId,
          {
            immediateResponsible: body.immediateResponsible,
          },
          404,
        ),
      );
    }

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

    if (body.signIncidentsRole && !existingSignIncidentsRole) {
      return handleHttpResponse(
        HttpResponse.failure(
          HttpMessages.administrativeOrganizations.signIncidentsRoleNotFound,
          {
            sign_incidents_role: body.signIncidentsRole,
          },
          404,
        ),
      );
    }

    if (body.signRequestsRole && !existingSignRequestsRole) {
      return handleHttpResponse(
        HttpResponse.failure(
          HttpMessages.administrativeOrganizations.signRequestsRoleNotFound,
          {
            sign_requests_role: body.signRequestsRole,
          },
          404,
        ),
      );
    }

    const rolesToCreate: Array<{ roleId: number; employeeId: number; signIncidents: boolean; signRequests: boolean }> =
      [];

    if (body.director) {
      rolesToCreate.push({
        roleId: directorRole.id,
        employeeId: body.director,
        signIncidents: body.signIncidentsRole === directorRole.id,
        signRequests: body.signRequestsRole === directorRole.id,
      });
    }

    if (body.secretary) {
      rolesToCreate.push({
        roleId: secretaryRole!.id,
        employeeId: body.secretary,
        signIncidents: body.signIncidentsRole === secretaryRole!.id,
        signRequests: body.signRequestsRole === secretaryRole!.id,
      });
    }

    if (body.coordinator) {
      rolesToCreate.push({
        roleId: coordinatorRole!.id,
        employeeId: body.coordinator,
        signIncidents: body.signIncidentsRole === coordinatorRole!.id,
        signRequests: body.signRequestsRole === coordinatorRole!.id,
      });
    }

    if (body.immediateResponsible) {
      rolesToCreate.push({
        roleId: immediateResponsibleRole!.id,
        employeeId: body.immediateResponsible,
        signIncidents: body.signIncidentsRole === immediateResponsibleRole!.id,
        signRequests: body.signRequestsRole === immediateResponsibleRole!.id,
      });
    }

    const createdLeaders = await AdministrativeOrganizationLeadersService.createLeaders({
      direccionId: body.direccionId,
      startDate: body.startDate,
      endDate: body.endDate,
      createdById: body.createdById,
      roles: rolesToCreate,
    });

    const activeRoleIds = rolesToCreate.map((role) => role.roleId);
    await AdministrativeOrganizationLeadersService.deactivateOtherLeaders(
      body.direccionId,
      activeRoleIds,
      body.createdById,
    );

    return handleHttpResponse(
      HttpResponse.success(HttpMessages.administrativeOrganizations.leadersCreatedSuccess, createdLeaders),
    );
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
