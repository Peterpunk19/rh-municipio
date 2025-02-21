import http from "@/lib/http";
import { IResponse } from "@/utils/types";

export const getUserById = async (id: number) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";
    const response = await fetch(`${baseUrl}/api/user/getById`, {
      method: "POST",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to get user information");
    }
    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    console.error("Error fetching user information", error);
  }
};

export const createUser = async (data: object): Promise<IResponse> => {
  try {
    const response = await http.post<IResponse>("/api/user/create", data);
    return response.data;
  } catch (error: any) {
    return error;
  }
};
