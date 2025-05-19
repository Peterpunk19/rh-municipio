import { generator } from "./generator";

export const request = {
  emptyId: generator.request({ requestId: 0 }),
  idNotNumber: generator.request({ requestId: Number.NaN }),
  idZero: generator.request({ requestId: 0 }),
  idNegative: generator.request({ requestId: -1 }),
  idLong: generator.request({ requestId: Number("9".repeat(16)) }),
  emptyStatus: generator.request({ status: "" }),
  invalidStatus: generator.request({ status: "invalid_status" }),
  validData: generator.request(),
};
