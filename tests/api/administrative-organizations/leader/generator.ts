import { HttpMessages } from "@/common/response/messages";
import type { IResponse } from "@/utils/types";
import type { ICreateUpdateLeader } from "@/app/api/administrative-organizations/types";

export const generator = {
  request: (overrides?: Partial<ICreateUpdateLeader>): ICreateUpdateLeader => ({
    direccionId: overrides?.direccionId ?? 5,
    director: overrides?.director ?? 40,
    deputyDirector: overrides?.deputyDirector ?? 42,
    startDate: overrides?.startDate ?? "2025-05-05",
    endDate: overrides?.endDate ?? "2026-05-05",
    createdById: overrides?.createdById ?? 1,
  }),
  response: (overrides?: Partial<IResponse>): IResponse => ({
    success: overrides?.success ?? false,
    message: overrides?.message ?? HttpMessages.error.validationFields,
    responseObject: overrides?.responseObject ?? [],
    statusCode: overrides?.statusCode ?? 400,
  }),
};
