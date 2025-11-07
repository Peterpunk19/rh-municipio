import { genPayload, genId, genYear } from "./generator";

export const testCases = {
  getByYear: [
    {
      name: "should GET salaries by year and return IResponse",
      year: genYear(2025),
      expectCategoriesCount: 1,
    },
  ],
  update: [
    {
      name: "should PUT payload and return IResponse",
      id: genId(10),
      payload: genPayload({ salary: 123.45 }),
    },
  ],
  create: [
    {
      name: "should POST payload and return IResponse",
      payload: genPayload({ salary: 99.99 }),
      expectedId: 11,
    },
  ],
};
