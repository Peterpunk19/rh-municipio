import http from "@/lib/http";
import type { IResponse } from "@/utils/types";

export const getAdministrativesOrganizations = async (): Promise<IResponse> => {
  try {
    const response = await http.get<IResponse>("/api/administrative-organizations");
    return response.data;
  } catch (error: any) {
    return error;
  }
};
