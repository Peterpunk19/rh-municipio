import { ConfigYearsTestCase } from "./ConfigYearsTestCase";

const testCase = new ConfigYearsTestCase();

export const dataProvider = {
  successGetAll: testCase.create("successGetAll", 200),
  errorGetAll: testCase.create("errorGetAll", 500),
};
