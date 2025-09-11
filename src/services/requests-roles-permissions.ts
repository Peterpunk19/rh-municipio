import http from "@/lib/http";
import type { IResponse } from "@/utils/types";

export const getRequestsRolesPermissions = async (data: {}): Promise<IResponse> => {
  try {
    const urlParams = new URLSearchParams(data).toString();
    const url = urlParams
      ? `/api/catalogs/requests-roles-permissions?${urlParams}`
      : "/api/catalogs/requests-roles-permissions";

    const response = await http.get<IResponse>(url);
    return response.data;
  } catch (error: any) {
    return error;
  }
};

export const updateRequestsRolesPermissionsStatus = async (id: number, data: any): Promise<IResponse> => {
  try {
    const response = await http.patch<IResponse>(
      `/api/catalogs/requests-roles-permissions/${id}/status`,
      JSON.stringify(data),
    );
    return response.data;
  } catch (error: any) {
    return error;
  }
};
