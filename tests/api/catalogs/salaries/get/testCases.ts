import { dataProvider } from "./dataProvider";
import type { ISalariesFilters } from "@/app/api/catalogs/salaries/types";

export const testCases = [
  {
    description: "should successfully send message with valid data",
    requestData: dataProvider.validData.request as ISalariesFilters,
    expectedStatus: dataProvider.validData.status,
    expectedResponse: dataProvider.validData.response,
  },
  {
    description: "should return error for page not number",
    requestData: dataProvider.pageNotNumber.request as ISalariesFilters,
    expectedStatus: dataProvider.pageNotNumber.status,
    expectedResponse: dataProvider.pageNotNumber.response,
  },
  {
    description: "should return error for page zero",
    requestData: dataProvider.pageZero.request as ISalariesFilters,
    expectedStatus: dataProvider.pageZero.status,
    expectedResponse: dataProvider.pageZero.response,
  },
  {
    description: "should return error for page negative",
    requestData: dataProvider.pageNegative.request as ISalariesFilters,
    expectedStatus: dataProvider.pageNegative.status,
    expectedResponse: dataProvider.pageNegative.response,
  },
  {
    description: "should return error for limit not number",
    requestData: dataProvider.limitNotNumber.request as ISalariesFilters,
    expectedStatus: dataProvider.limitNotNumber.status,
    expectedResponse: dataProvider.limitNotNumber.response,
  },
  {
    description: "should return error for limit zero",
    requestData: dataProvider.limitZero.request as ISalariesFilters,
    expectedStatus: dataProvider.limitZero.status,
    expectedResponse: dataProvider.limitZero.response,
  },
  {
    description: "should return error for limit negative",
    requestData: dataProvider.limitNegative.request as ISalariesFilters,
    expectedStatus: dataProvider.limitNegative.status,
    expectedResponse: dataProvider.limitNegative.response,
  },
  {
    description: "should return error for long search",
    requestData: dataProvider.searchLong.request as ISalariesFilters,
    expectedStatus: dataProvider.searchLong.status,
    expectedResponse: dataProvider.searchLong.response,
  },
];
