import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import { CatalogsService } from "@/app/api/services/catalogs.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const direccionId = Number(searchParams.get("id"));

    if (!direccionId) {
      const response = HttpResponse.failure(HttpMessages.error.notFound, {});
      return handleHttpResponse(response);
    }

    const departamentos = await CatalogsService.getDepartamentos(direccionId);

    if (!departamentos.length) {
      const response = HttpResponse.failure(HttpMessages.error.notFound, {});
      return handleHttpResponse(response);
    }

    const response = HttpResponse.success(HttpMessages.catalog.success, departamentos);

    return handleHttpResponse(response);
  } catch (error: any) {
    const response = HttpResponse.internalServerError(HttpMessages.error.internalServerError, { error: error.message });

    return handleHttpResponse(response);
  }
}
