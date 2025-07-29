import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import { CatalogsService } from "@/app/api/services/catalogs.service";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const roleId = request.nextUrl.searchParams.get("roleId");
    const data = roleId
      ? await CatalogsService.getIncidentsByRoleCanCreate(Number(roleId))
      : await CatalogsService.getIncidents();

    const response = HttpResponse.success(HttpMessages.catalog.success, data);

    return handleHttpResponse(response);
  } catch (error: any) {
    const response = HttpResponse.internalServerError(HttpMessages.error.internalServerError, { error: error.message });

    return handleHttpResponse(response);
  }
}
