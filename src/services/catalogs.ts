import http from "@/lib/http";
import type { IResponseObject } from "@/utils/types";

export const fetchGenderData = async (): Promise<IResponseObject | null> => {
  try {
    const response = await http.get<IResponseObject>("/api/catalogs/gender");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch gender:", error);
    return null;
  }
};

export const fetchCategoryData = async (options?: { signal?: AbortSignal }): Promise<IResponseObject | null> => {
  try {
    const response = await http.get<IResponseObject>("/api/catalogs/category", {
      signal: options?.signal,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch category:", error);
    return null;
  }
};

export const fetchSecretariasData = async (): Promise<IResponseObject | null> => {
  try {
    const response = await http.get<IResponseObject>("/api/catalogs/secretarias");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch secretarias:", error);
    return null;
  }
};

export const fetchDireccionesData = async (secretariaId: string): Promise<IResponseObject | null> => {
  if (!secretariaId || secretariaId === "0") return null;

  try {
    const response = await http.get<IResponseObject>(`/api/catalogs/direcciones?id=${secretariaId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch direcciones:", error);
    return null;
  }
};

export const fetchEmployeeTypesData = async (): Promise<IResponseObject | null> => {
  try {
    const response = await http.get<IResponseObject>("/api/catalogs/employee-type");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch employeeType:", error);
    return null;
  }
};

export const fetchLocationsData = async (): Promise<IResponseObject | null> => {
  try {
    const response = await http.get<IResponseObject>("/api/catalogs/location");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch location:", error);
    return null;
  }
};

export const fetchDayData = async (): Promise<IResponseObject | null> => {
  try {
    const response = await http.get<IResponseObject>("/api/catalogs/day");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch day:", error);
    return null;
  }
};

export const fetchHoursData = async (): Promise<IResponseObject | null> => {
  try {
    const response = await http.get<IResponseObject>("/api/catalogs/hour");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch hour:", error);
    return null;
  }
};

export const fetchStatesData = async (): Promise<IResponseObject | null> => {
  try {
    const response = await http.get<IResponseObject>("/api/catalogs/state");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch states:", error);
    return null;
  }
};

export const fetchMunicipalitiesData = async (stateId: string): Promise<IResponseObject | null> => {
  if (!stateId || stateId === "0") return null;

  try {
    const response = await http.get<IResponseObject>(`/api/catalogs/municipality?id=${stateId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch municipalities:", error);
    return null;
  }
};

export const fetchCatalogData = async (name: any): Promise<IResponseObject | null> => {
  try {
    const response = await http.get<IResponseObject>(`/api/catalogs/${name}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch ${name}:`, error);
    return null;
  }
};

export const fetchEmployeeStatusData = async (): Promise<IResponseObject | null> => {
  try {
    const response = await http.get<IResponseObject>("/api/catalogs/employeeStatus");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch category:", error);
    return null;
  }
};

export const fetchRolesData = async (): Promise<IResponseObject | null> => {
  try {
    const response = await http.get<IResponseObject>("/api/catalogs/roles");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch role:", error);
    return null;
  }
};
