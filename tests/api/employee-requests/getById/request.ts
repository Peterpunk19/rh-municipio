import { generator } from "./generator";

export const request = {
  idNotNumber: generator.request({ id: "a" }),
  idZero: generator.request({ id: 0 }),
  idNegative: generator.request({ id: -1 }),
  idLong: generator.request({ id: Number("9".repeat(16)) }),
  validData: generator.request({ id: 1 }),
};
