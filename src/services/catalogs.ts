import http from "@/lib/http";
import { logger } from "@/lib/logger";
import type { IResponse, IResponseObject } from "@/utils/types";

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

export const fetchSecretariasData = async (): Promise<IResponseObject> => {
  try {
    const response = await http.get<IResponseObject>("/api/catalogs/secretarias");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch secretarias:", error);
    return { success: false, responseObject: [] };
  }
};

export const fetchDireccionesData = async (secretariaId: string): Promise<IResponseObject> => {
  if (!secretariaId || secretariaId === "0") return { success: false, responseObject: [] };

  try {
    const response = await http.get<IResponseObject>(`/api/catalogs/direcciones?id=${secretariaId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch direcciones:", error);
    return { success: false, responseObject: [] };
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

export const fetchAttendanceData = async (): Promise<IResponseObject | null> => {
  try {
    const response = await http.get<IResponseObject>("/api/catalogs/attendance");
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

export const fetchCatalogData = async (catalogName: string, params?: Record<string, any>) => {
  try {
    const baseUrl = `/api/catalogs/${catalogName}`;

    let url = baseUrl;
    if (params && Object.keys(params).length > 0) {
      const urlParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          urlParams.append(key, value.toString());
        }
      });
      const queryString = urlParams.toString();
      if (queryString) {
        url += `? ${queryString}`;
      }
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}, URL: ${url}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error(`Expected JSON response but got ${contentType || "unknown"} from ${url}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(`Error fetching ${catalogName} catalog:`, error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error desconocido",
      responseObject: [],
    };
  }
};

export const fetchStatusIncidentsData = async (data: any): Promise<IResponseObject | null> => {
  try {
    const urlParams = new URLSearchParams(data).toString();
    const url = urlParams ? `/api/catalogs/incidents-status?${urlParams}` : "/api/catalogs/incidents-status";

    const response = await http.get<IResponseObject>(url);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch status incidents:`, error);
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

export const fetchSalaryData = async (categoryId: number, employeeTypeId: number): Promise<IResponse | null> => {
  try {
    const response = await http.get<IResponse>(
      `/api/catalogs/salary?categoryId=${categoryId}&employeeTypeId=${employeeTypeId}`,
    );
    return response.data;
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack });
    return null;
  }
};

export const catalogs = {
  requests: "requests",
  locations: "locations",
  days: "days",
  hours: "hours",
};
