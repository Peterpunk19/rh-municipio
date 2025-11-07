import http from "@/lib/http";

export const mockHttpGet = (data: any) => jest.spyOn(http, "get").mockResolvedValueOnce({ data } as any);
export const mockHttpGetReject = (error: any) => jest.spyOn(http, "get").mockRejectedValueOnce(error);

export const requests = {
  successGetAll: { url: "/api/catalogs/config-years" },
  errorGetAll: { url: "/api/catalogs/config-years" },
};
