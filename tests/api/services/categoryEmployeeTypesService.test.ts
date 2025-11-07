import http from "@/lib/http";
import { getByYear, update, create } from "@/services/category-employee-types";
import { mockHttpGet, mockHttpPost, mockHttpPut } from "./category-employee-types/request";
import { makeGetByYearUrl, makePostUrl, makePutUrl, makeSuccessResponse } from "./category-employee-types/dataProvider";
import { testCases } from "./category-employee-types/testCases";

describe("category-employee-types services", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getByYear", () => {
    it(testCases.getByYear[0].name, async () => {
      const { year, expectCategoriesCount } = testCases.getByYear[0];
      mockHttpGet(
        makeSuccessResponse({
          categories: [{ id: 1, name: "Cat", display_name: "Cat" }],
          employeeTypes: [{ id: 1, name: "Type", display_name: "Type" }],
          data: [],
        }),
      );

      const result = await getByYear(year);
      expect(http.get).toHaveBeenCalledWith(makeGetByYearUrl(year));
      expect(result.success).toBe(true);
      expect((result as any).responseObject.categories.length).toBe(expectCategoriesCount);
    });
  });

  describe("update", () => {
    it(testCases.update[0].name, async () => {
      const { id, payload } = testCases.update[0];
      mockHttpPut(makeSuccessResponse({ id, ...payload }));

      const result = await update(id, payload);
      expect(http.put).toHaveBeenCalledWith(makePutUrl(id), payload);
      expect(result.success).toBe(true);
      expect((result as any).responseObject.id).toBe(id);
    });
  });

  describe("create", () => {
    it(testCases.create[0].name, async () => {
      const { payload, expectedId } = testCases.create[0];
      mockHttpPost(makeSuccessResponse({ id: expectedId, ...payload }));

      const result = await create(payload);
      expect(http.post).toHaveBeenCalledWith(makePostUrl(), payload);
      expect(result.success).toBe(true);
      expect((result as any).responseObject.id).toBe(expectedId);
    });
  });
});
