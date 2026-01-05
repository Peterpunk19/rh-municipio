import type { ICatalogCreate } from "@/interfaces/Catalogs";
import { HttpMessages } from "@/common/response/messages";
import type { IResponse } from "@/utils/types";

export const generator = {
  request: (overrides?: Partial<ICatalogCreate>): ICatalogCreate => ({
    name: overrides?.name ?? "test_catalog",
    display_name: overrides?.display_name ?? "Test Catalog",
    active: overrides?.active ?? true,
  }),
  response: (overrides?: Partial<IResponse>): IResponse => ({
    success: overrides?.success ?? false,
    message: overrides?.message ?? HttpMessages.error.validationFields,
    responseObject: overrides?.responseObject ?? [],
    statusCode: overrides?.statusCode ?? 400,
  }),
};
