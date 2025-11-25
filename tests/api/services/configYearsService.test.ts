import http from "@/lib/http";
import { getAll } from "@/services/config-years";
import { dataProvider } from "./config-years/dataProvider";
import { mockHttpGet, mockHttpGetReject } from "./config-years/request";
import { testCases } from "./config-years/testCases";

jest.mock("@/lib/logger", () => ({ logger: { error: jest.fn() } }));

describe("config-years services", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it(testCases.getAll[0].description, async () => {
      const { request, response } = dataProvider.successGetAll;
      mockHttpGet(response);

      const result = await getAll();
      expect(http.get).toHaveBeenCalledWith(request.url);
      expect(result.success).toBe(true);
      expect(result.responseObject.length).toBe(1);
    });

    it(testCases.getAll[1].description, async () => {
      const { request, error } = dataProvider.errorGetAll as any;
      mockHttpGetReject(error);

      const result = await getAll();
      expect((result as any).message).toBe("network error");
    });
  });
});
