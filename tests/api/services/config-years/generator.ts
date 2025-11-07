import type { IResponse } from "@/utils/types";
import { HttpMessages } from "@/common/response/messages";

const yearNow = () => new Date().getFullYear();

export const generator = {
  configYear: (overrides: Partial<any> = {}) => ({
    id: overrides.id ?? 1,
    year: overrides.year ?? yearNow(),
    display_name: overrides.display_name ?? String(overrides.year ?? yearNow()),
    active: overrides.active ?? true,
    created_at: overrides.created_at ?? new Date().toISOString(),
    updated_at: overrides.updated_at ?? new Date().toISOString(),
  }),
  error: (message = "network error") => {
    const err: any = new Error(message);
    return err;
  },
  response: (overrides?: Partial<IResponse>): IResponse => ({
    success: overrides?.success ?? true,
    message: overrides?.message ?? HttpMessages.catalog.success,
    responseObject: overrides?.responseObject ?? [],
    statusCode: overrides?.statusCode ?? 200,
  }),
};
