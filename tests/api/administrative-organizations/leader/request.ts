import { generator } from "./generator";

export const request = {
  validData: generator.request(),
  direccionIdNotNumber: generator.request({ direccionId: "a" as unknown as number }),
  direccionIdZero: generator.request({ direccionId: 0 }),
  direccionIdNegative: generator.request({ direccionId: -1 }),
  direccionIdLong: generator.request({ direccionId: Number("9".repeat(16)) }),
  directorNotNumber: generator.request({ director: "a" as unknown as number }),
  directorZero: generator.request({ director: 0 }),
  directorNegative: generator.request({ director: -1 }),
  directorLong: generator.request({ director: Number("9".repeat(16)) }),
  deputyDirectorNotNumber: generator.request({ deputyDirector: "a" as unknown as number }),
  deputyDirectorZero: generator.request({ deputyDirector: 0 }),
  deputyDirectorNegative: generator.request({ deputyDirector: -1 }),
  deputyDirectorLong: generator.request({ deputyDirector: Number("9".repeat(16)) }),
  emptyStartDate: generator.request({ startDate: "" }),
  emptyEndDate: generator.request({ endDate: "" }),
};
