import { HttpMessages } from "@/common/response/messages";
import type { IResponse } from "@/utils/types";
import type { ICreateUpdateLeader } from "@/app/api/administrative-organizations/types";

export const generator = {
  request: (overrides?: Partial<ICreateUpdateLeader>): ICreateUpdateLeader => ({
    direccionId: overrides?.direccionId ?? 5,
    director: overrides?.director ?? 355,
    secretary: overrides?.secretary ?? 369,
    coordinator: overrides?.coordinator ?? 490,
    immediateResponsible: overrides?.immediateResponsible ?? 110,
    signIncidentsRole: overrides?.signIncidentsRole ?? 15,
    signRequestsRole: overrides?.signRequestsRole ?? 16,
    startDate: overrides?.startDate ?? "2025-10-01",
    endDate: overrides?.endDate ?? "2026-12-31",
    createdById: overrides?.createdById ?? 1,
  }),
  response: (overrides?: Partial<IResponse>): IResponse => ({
    success: overrides?.success ?? false,
    message: overrides?.message ?? HttpMessages.error.validationFields,
    responseObject: overrides?.responseObject ?? [],
    statusCode: overrides?.statusCode ?? 400,
  }),
};
