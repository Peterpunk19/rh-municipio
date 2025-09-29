import { LeadersTestCase } from "./LeadersTestCase";

const LeadersTest = new LeadersTestCase();

export const dataProvider = {
  validData: LeadersTest.create("validData", 200),
  direccionIdNotNumber: LeadersTest.create("direccionIdNotNumber", 400),
  direccionIdZero: LeadersTest.create("direccionIdZero", 400),
  direccionIdNegative: LeadersTest.create("direccionIdNegative", 400),
  direccionIdLong: LeadersTest.create("direccionIdLong", 400),
  directorNotNumber: LeadersTest.create("directorNotNumber", 400),
  directorZero: LeadersTest.create("directorZero", 400),
  directorNegative: LeadersTest.create("directorNegative", 400),
  directorLong: LeadersTest.create("directorLong", 400),
  secretaryNotNumber: LeadersTest.create("secretaryNotNumber", 400),
  secretaryZero: LeadersTest.create("secretaryZero", 400),
  secretaryNegative: LeadersTest.create("secretaryNegative", 400),
  secretaryLong: LeadersTest.create("secretaryLong", 400),
  coordinatorNotNumber: LeadersTest.create("coordinatorNotNumber", 400),
  coordinatorZero: LeadersTest.create("coordinatorZero", 400),
  coordinatorNegative: LeadersTest.create("coordinatorNegative", 400),
  coordinatorLong: LeadersTest.create("coordinatorLong", 400),
  immediateResponsibleNotNumber: LeadersTest.create("immediateResponsibleNotNumber", 400),
  immediateResponsibleZero: LeadersTest.create("immediateResponsibleZero", 400),
  immediateResponsibleNegative: LeadersTest.create("immediateResponsibleNegative", 400),
  immediateResponsibleLong: LeadersTest.create("immediateResponsibleLong", 400),
  emptyStartDate: LeadersTest.create("emptyStartDate", 400),
  emptyEndDate: LeadersTest.create("emptyEndDate", 400),
};
