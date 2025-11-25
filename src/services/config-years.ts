import http from "@/lib/http";
import { logger } from "@/lib/logger";
import type { IResponse } from "@/utils/types";

export const getAll = async (): Promise<IResponse> => {
  try {
    const response = await http.get<IResponse>("/api/catalogs/config-years");
    return response.data;
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack });
    return error;
  }
};
