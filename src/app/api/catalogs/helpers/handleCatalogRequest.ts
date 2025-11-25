import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import { getParamsFromUrl } from "@/common/utils";
import { authMiddleware } from "@/middleware/authMiddleware";
import { validateRequestByUrlParams } from "@/common/request/validateRequest";
import { NextResponse } from "next/server";
import { ICatalogFilters } from "@/interfaces/Catalogs";
import { z } from "zod";

interface CatalogRequestConfig {
  request: Request;
  filterSchema: z.ZodSchema<any>;
  serviceMethod: (filters?: ICatalogFilters) => Promise<any[]>;
  additionalParams?: Record<string, any>;
}

export async function handleCatalogRequest({
  request,
  filterSchema,
  serviceMethod,
  additionalParams = {},
}: CatalogRequestConfig) {
  try {
    const requestParams = {
      page: null,
      limit: null,
      search: null,
      active: null,
      ...additionalParams,
    };

    const params = await getParamsFromUrl(request, requestParams);

    const authData: Awaited<ReturnType<typeof authMiddleware>> = await authMiddleware();

    if (authData instanceof NextResponse) {
      return authData;
    }

    let filters: ICatalogFilters | undefined;

    if (params.page || params.limit || params.search || Object.keys(additionalParams).length > 0) {
      const validationRequest = await validateRequestByUrlParams<ICatalogFilters>(params, filterSchema);

      if (validationRequest.response) return validationRequest.response;

      if (!validationRequest.data) {
        const response = HttpResponse.failure(HttpMessages.error.validationFields, {});
        return handleHttpResponse(response);
      }

      filters = validationRequest.data;
    }

    const data = await serviceMethod(filters);

    const responseData =
      (data as any).total !== undefined
        ? {
            data,
            total: (data as any).total,
            page: (data as any).page,
            limit: (data as any).limit,
          }
        : data;

    const response = HttpResponse.success(HttpMessages.catalog.success, responseData);

    return handleHttpResponse(response);
  } catch (error: any) {
    const response = HttpResponse.internalServerError(HttpMessages.error.internalServerError, { error: error.message });

    return handleHttpResponse(response);
  }
}
