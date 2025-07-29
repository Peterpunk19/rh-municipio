import http from "@/lib/http";
import type { IResponse } from "@/utils/types";

export const getIncidentsRolesPermissions = async (data: {}): Promise<IResponse> => {
  try {
    const urlParams = new URLSearchParams(data).toString();
    const url = urlParams
      ? `/api/catalogs/incidents-roles-permissions?${urlParams}`
      : "/api/catalogs/incidents-roles-permissions";

    const response = await http.get<IResponse>(url);
    return response.data;
  } catch (error: any) {
    return error;
  }
};
