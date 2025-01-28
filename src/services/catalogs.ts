import http from "@/lib/http";
import { IResponseObject } from "@/utils/types";

export const fetchGenderData = async (): Promise<IResponseObject | null> => {
  try {
    const response = await http.get<IResponseObject>("/api/catalogs/gender");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch gender:", error);
    return null;
  }
};
