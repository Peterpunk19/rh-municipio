import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import { CatalogsService } from "@/app/api/services/catalogs.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const stateId = Number(searchParams.get("id"));

    if (!stateId) {
      const response = HttpResponse.failure(HttpMessages.error.notFound, {});
      return handleHttpResponse(response);
    }

    const municipality = await CatalogsService.getMunicipalities(stateId);

    if (!municipality.length) {
      const response = HttpResponse.failure(HttpMessages.error.notFound, {});
      return handleHttpResponse(response);
    }

    const response = HttpResponse.success(HttpMessages.catalog.success, municipality);

    return handleHttpResponse(response);
  } catch (error: any) {
    const response = HttpResponse.internalServerError(HttpMessages.error.internalServerError, { error: error.message });

    return handleHttpResponse(response);
  }
}
