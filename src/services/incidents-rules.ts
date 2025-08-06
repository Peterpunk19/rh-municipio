import http from "@/lib/http";
import type { IResponse } from "@/utils/types";

export const getIncidentsRules = async (data: {}): Promise<IResponse> => {
  try {
    const urlParams = new URLSearchParams(data).toString();
    const url = urlParams ? `/api/catalogs/incidents-rules?${urlParams}` : "/api/catalogs/incidents-rules";

    const response = await http.get<IResponse>(url);
    return response.data;
  } catch (error: any) {
    return error;
  }
};
