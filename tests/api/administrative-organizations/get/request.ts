import { generator } from "./generator";

export const request = {
  validData: generator.request(),
  pageNotNumber: generator.request({ page: "a" as unknown as number }),
  pageZero: generator.request({ page: 0 }),
  pageNegative: generator.request({ page: -1 }),
  limitNotNumber: generator.request({ limit: "a" as unknown as number }),
  limitZero: generator.request({ limit: 0 }),
  limitNegative: generator.request({ limit: -1 }),
  limitLong: generator.request({ limit: Number("9".repeat(16)) }),
  searchLong: generator.request({ search: "a".repeat(256) }),
};
