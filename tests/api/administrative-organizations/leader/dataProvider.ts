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
  deputyDirectorNotNumber: LeadersTest.create("deputyDirectorNotNumber", 400),
  deputyDirectorZero: LeadersTest.create("deputyDirectorZero", 400),
  deputyDirectorNegative: LeadersTest.create("deputyDirectorNegative", 400),
  deputyDirectorLong: LeadersTest.create("deputyDirectorLong", 400),
  emptyStartDate: LeadersTest.create("emptyStartDate", 400),
  emptyEndDate: LeadersTest.create("emptyEndDate", 400),
};
