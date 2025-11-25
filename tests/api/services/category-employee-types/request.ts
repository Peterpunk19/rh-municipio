import http from "@/lib/http";

export const mockHttpGet = (data: any) => jest.spyOn(http, "get").mockResolvedValueOnce({ data } as any);
export const mockHttpPut = (data: any) => jest.spyOn(http, "put").mockResolvedValueOnce({ data } as any);
export const mockHttpPost = (data: any) => jest.spyOn(http, "post").mockResolvedValueOnce({ data } as any);
