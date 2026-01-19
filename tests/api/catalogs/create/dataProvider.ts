import { CatalogsTestCase } from "./CatalogsTestCase";

const catalogTestCase = new CatalogsTestCase();

export const dataProvider = {
  invalidRequest: catalogTestCase.create("emptyParams"),
  emptyName: catalogTestCase.create("emptyName"),
  emptyDisplayName: catalogTestCase.create("emptyDisplayName"),
  longName: catalogTestCase.create("longName"),
  longDisplayName: catalogTestCase.create("longDisplayName"),
  validData: catalogTestCase.create("validData", 200),
  validDataInactive: catalogTestCase.create("validDataInactive", 200),
};
