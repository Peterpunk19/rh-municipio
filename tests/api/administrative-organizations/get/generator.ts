import { HttpMessages } from "@/common/response/messages";
import type { IResponse } from "@/utils/types";
import type { IAdministrativeOrganizationsFilters } from "@/app/api/administrative-organizations/types";

export const generator = {
  request: (overrides?: Partial<IAdministrativeOrganizationsFilters>): IAdministrativeOrganizationsFilters => ({
    page: overrides?.page ?? 1,
    limit: overrides?.limit ?? 10,
    search: overrides?.search ?? "",
  }),
  response: (overrides?: Partial<IResponse>): IResponse => ({
    success: overrides?.success ?? false,
    message: overrides?.message ?? HttpMessages.error.validationFields,
    responseObject: overrides?.responseObject ?? [],
    statusCode: overrides?.statusCode ?? 400,
  }),
};
