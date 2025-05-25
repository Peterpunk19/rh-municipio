import { GetTestCase } from "./GetTestCase";

const GetTest = new GetTestCase();

export const dataProvider = {
  validData: GetTest.create("validData", 200),
  pageNotNumber: GetTest.create("pageNotNumber", 400),
  pageZero: GetTest.create("pageZero", 400),
  pageNegative: GetTest.create("pageNegative", 400),
  limitNotNumber: GetTest.create("limitNotNumber", 400),
  limitZero: GetTest.create("limitZero", 400),
  limitNegative: GetTest.create("limitNegative", 400),
  searchLong: GetTest.create("searchLong", 400),
};
