import { HttpMessages } from "@/common/response/messages";
import type { IResponse } from "@/utils/types";
import type { IUserById } from "@/app/api/users/interface";

export const generator = {
  request: (overrides?: { id: number | string }): IUserById => ({
    id: (overrides?.id as any) ?? 1,
  }),
  response: (overrides?: Partial<IResponse>): IResponse => ({
    success: overrides?.success ?? false,
    message: overrides?.message ?? HttpMessages.error.validationFields,
    responseObject: overrides?.responseObject ?? [],
    statusCode: overrides?.statusCode ?? 400,
  }),
};
