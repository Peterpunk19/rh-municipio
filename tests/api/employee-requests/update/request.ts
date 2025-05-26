import { generator } from "./generator";

export const request = {
  emptyId: { statusId: 2 },
  idNotNumber: { requestId: "not_a_number", statusId: 2 },
  idZero: generator.request({ requestId: 0 }),
  idNegative: generator.request({ requestId: -1 }),
  idLong: generator.request({ requestId: Number("9".repeat(16)) }),
  emptyStatus: { requestId: 15 },
  invalidStatus: generator.request({ statusId: 999 }),
  validData: generator.request(),
};
