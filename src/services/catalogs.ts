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

export const fetchCategoryData = async (): Promise<IResponseObject | null> => {
  try {
    const response = await http.get<IResponseObject>("/api/catalogs/category");
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

export const fetchDireccionesData = async (secretariaId: number): Promise<IResponseObject | null> => {
  if (!secretariaId || secretariaId == 0) return null;

  try {
    const response = await http.get<IResponseObject>(`/api/catalogs/direcciones?id=${secretariaId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch direcciones:", error);
    return null;
  }
};

export const fetchDepartamentosData = async (direccionId: number): Promise<IResponseObject | null> => {
  if (!direccionId || direccionId == 0) return null;

  try {
    const response = await http.get<IResponseObject>(`/api/catalogs/departamentos?id=${direccionId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch departamentos:", error);
    return null;
  }
};

export const fetchEmployeeTypesData = async (): Promise<IResponseObject | null> => {
  try {
    const response = await http.get<IResponseObject>("/api/catalogs/employeeType");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch employeeType:", error);
    return null;
  }
};

export const fetchPayrollsData = async (): Promise<IResponseObject | null> => {
  try {
    const response = await http.get<IResponseObject>("/api/catalogs/payroll");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch payroll:", error);
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
