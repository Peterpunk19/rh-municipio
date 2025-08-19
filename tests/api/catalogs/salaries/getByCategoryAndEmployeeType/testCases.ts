import { dataProvider } from "./dataProvider";
import type { ISalariesByCategoryAndEmployeeTypeFilters } from "@/app/api/catalogs/salaries/types";

export const testCases = [
  {
    description: "should successfully send message with valid data",
    requestData: dataProvider.validData.request as ISalariesByCategoryAndEmployeeTypeFilters,
    expectedStatus: dataProvider.validData.status,
    expectedResponse: dataProvider.validData.response,
  },
  {
    description: "should return error for categoryId not number",
    requestData: dataProvider.categoryIdNotNumber.request as ISalariesByCategoryAndEmployeeTypeFilters,
    expectedStatus: dataProvider.categoryIdNotNumber.status,
    expectedResponse: dataProvider.categoryIdNotNumber.response,
  },
  {
    description: "should return error for employeeTypeId not number",
    requestData: dataProvider.employeeTypeIdNotNumber.request as ISalariesByCategoryAndEmployeeTypeFilters,
    expectedStatus: dataProvider.employeeTypeIdNotNumber.status,
    expectedResponse: dataProvider.employeeTypeIdNotNumber.response,
  },
  {
    description: "should return error for categoryId zero",
    requestData: dataProvider.categoryIdZero.request as ISalariesByCategoryAndEmployeeTypeFilters,
    expectedStatus: dataProvider.categoryIdZero.status,
    expectedResponse: dataProvider.categoryIdZero.response,
  },
  {
    description: "should return error for employeeTypeId zero",
    requestData: dataProvider.employeeTypeIdZero.request as ISalariesByCategoryAndEmployeeTypeFilters,
    expectedStatus: dataProvider.employeeTypeIdZero.status,
    expectedResponse: dataProvider.employeeTypeIdZero.response,
  },
  {
    description: "should return error for categoryId negative",
    requestData: dataProvider.categoryIdNegative.request as ISalariesByCategoryAndEmployeeTypeFilters,
    expectedStatus: dataProvider.categoryIdNegative.status,
    expectedResponse: dataProvider.categoryIdNegative.response,
  },
  {
    description: "should return error for employeeTypeId negative",
    requestData: dataProvider.employeeTypeIdNegative.request as ISalariesByCategoryAndEmployeeTypeFilters,
    expectedStatus: dataProvider.employeeTypeIdNegative.status,
    expectedResponse: dataProvider.employeeTypeIdNegative.response,
  },
];
