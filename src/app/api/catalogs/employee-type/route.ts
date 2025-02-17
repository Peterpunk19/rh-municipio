import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import { CatalogsService } from "@/app/api/services/catalogs.service";

export const EmployeeTypeName = {
  BASE_SINDICALIZADO: "base_sindicalizado",
  BASE_NO_SINDICALIZADO: "base_no_sindicalizado",
} as const;

export const EmployeeTypeDisplayName: Record<(typeof EmployeeTypeName)[keyof typeof EmployeeTypeName], string> = {
  base_sindicalizado: "BASE SINDICALIZADO",
  base_no_sindicalizado: "BASE NO SINDICALIZADO",
};

export async function GET() {
  try {
    const data = await CatalogsService.getEmployeeTypes();

    if (!data.length) {
      const response = HttpResponse.failure(HttpMessages.error.notFound, {});
      return handleHttpResponse(response);
    }

    const response = HttpResponse.success(HttpMessages.catalog.success, data);

    return handleHttpResponse(response);
  } catch (error: any) {
    const response = HttpResponse.internalServerError(HttpMessages.error.internalServerError, { error: error.message });

    return handleHttpResponse(response);
  }
}
