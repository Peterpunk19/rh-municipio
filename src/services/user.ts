import http from "@/lib/http";
import { IResponse } from "@/utils/types";

export const getUserById = async (id: string): Promise<IResponse> => {
  try {
    const response = await http.get<IResponse>(`/api/users/${id}`);
    return response.data;
  } catch (error: any) {
    return error;
  }
};

export const createUser = async (data: object): Promise<IResponse> => {
  try {
    const response = await http.post<IResponse>("/api/users/create", data);
    return response.data;
  } catch (error: any) {
    return error;
  }
};

export const getUsers = async (data: string): Promise<IResponse> => {
  try {
    const urlParams = new URLSearchParams(data).toString();
    let url = "/api/users";
    if (urlParams.length > 0) {
      url = `${url}?${urlParams}`;
    }
    const response = await http.get<IResponse>(url);
    return response.data;
  } catch (error: any) {
    return error;
  }
};

export const changeStatusUser = async (data: object): Promise<IResponse> => {
  try {
    const response = await http.post<IResponse>("/api/users/deactivate", data);
    return response.data;
  } catch (error: any) {
    return error;
  }
};
