import { HttpMessages } from "@/common/response/messages";
import type { IResponse } from "@/utils/types";
import type { ISalariesFilters } from "@/app/api/catalogs/salaries/types";

export const generator = {
  request: (overrides?: Partial<ISalariesFilters>): ISalariesFilters => ({
    page: overrides?.page ?? 1,
    limit: overrides?.limit ?? 10,
    search: overrides?.search ?? "",
    categoryId: overrides?.categoryId ?? 1,
    employeeTypeId: overrides?.employeeTypeId ?? 1,
  }),
  response: (overrides?: Partial<IResponse>): IResponse => ({
    success: overrides?.success ?? false,
    message: overrides?.message ?? HttpMessages.error.validationFields,
    responseObject: overrides?.responseObject ?? [],
    statusCode: overrides?.statusCode ?? 400,
  }),
};
