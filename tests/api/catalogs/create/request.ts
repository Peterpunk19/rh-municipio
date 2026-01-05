import { generator } from "./generator";

export const request = {
  emptyParams: {},
  emptyName: generator.request({ name: "" }),
  emptyDisplayName: generator.request({ display_name: "" }),
  longName: generator.request({ name: "a".repeat(256) }),
  longDisplayName: generator.request({ display_name: "a".repeat(256) }),
  validData: generator.request({}),
  validDataInactive: generator.request({ active: false }),
};
