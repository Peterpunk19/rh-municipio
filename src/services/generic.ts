import http from "@/lib/http";
import type { IResponse } from "@/utils/types";

export const updateStatus = async (url: string, id: number, data: any): Promise<IResponse> => {
  try {
    const response = await http.patch<IResponse>(`${url}/${id}/status`, JSON.stringify(data));

    return response.data;
  } catch (error: any) {
    return error;
  }
};
