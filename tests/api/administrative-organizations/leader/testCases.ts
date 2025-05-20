import { dataProvider } from "./dataProvider";
import type { ICreateUpdateLeader } from "@/app/api/administrative-organizations/types";

export const testCases = [
  {
    description: "should successfully send message with valid data",
    requestData: dataProvider.validData.request as ICreateUpdateLeader,
    expectedStatus: dataProvider.validData.status,
    expectedResponse: dataProvider.validData.response,
  },
  {
    description: "should return error for direccionId not number",
    requestData: dataProvider.direccionIdNotNumber.request,
    expectedStatus: dataProvider.direccionIdNotNumber.status,
    expectedResponse: dataProvider.direccionIdNotNumber.response,
  },
  {
    description: "should return error for direccionId zero",
    requestData: dataProvider.direccionIdZero.request,
    expectedStatus: dataProvider.direccionIdZero.status,
    expectedResponse: dataProvider.direccionIdZero.response,
  },
  {
    description: "should return error for direccionId negative",
    requestData: dataProvider.direccionIdNegative.request,
    expectedStatus: dataProvider.direccionIdNegative.status,
    expectedResponse: dataProvider.direccionIdNegative.response,
  },
  {
    description: "should return error for direccionId too long",
    requestData: dataProvider.direccionIdLong.request,
    expectedStatus: dataProvider.direccionIdLong.status,
    expectedResponse: dataProvider.direccionIdLong.response,
  },
  {
    description: "should return error for director not number",
    requestData: dataProvider.directorNotNumber.request,
    expectedStatus: dataProvider.directorNotNumber.status,
    expectedResponse: dataProvider.directorNotNumber.response,
  },
  {
    description: "should return error for director zero",
    requestData: dataProvider.directorZero.request,
    expectedStatus: dataProvider.directorZero.status,
    expectedResponse: dataProvider.directorZero.response,
  },
  {
    description: "should return error for director negative",
    requestData: dataProvider.directorNegative.request,
    expectedStatus: dataProvider.directorNegative.status,
    expectedResponse: dataProvider.directorNegative.response,
  },
  {
    description: "should return error for director too long",
    requestData: dataProvider.directorLong.request,
    expectedStatus: dataProvider.directorLong.status,
    expectedResponse: dataProvider.directorLong.response,
  },
  {
    description: "should return error for deputyDirector not number",
    requestData: dataProvider.deputyDirectorNotNumber.request,
    expectedStatus: dataProvider.deputyDirectorNotNumber.status,
    expectedResponse: dataProvider.deputyDirectorNotNumber.response,
  },
  {
    description: "should return error for deputyDirector zero",
    requestData: dataProvider.deputyDirectorZero.request,
    expectedStatus: dataProvider.deputyDirectorZero.status,
    expectedResponse: dataProvider.deputyDirectorZero.response,
  },
  {
    description: "should return error for deputyDirector negative",
    requestData: dataProvider.deputyDirectorNegative.request,
    expectedStatus: dataProvider.deputyDirectorNegative.status,
    expectedResponse: dataProvider.deputyDirectorNegative.response,
  },
  {
    description: "should return error for deputyDirector too long",
    requestData: dataProvider.deputyDirectorLong.request,
    expectedStatus: dataProvider.deputyDirectorLong.status,
    expectedResponse: dataProvider.deputyDirectorLong.response,
  },
  {
    description: "should return error for empty startDate",
    requestData: dataProvider.emptyStartDate.request as ICreateUpdateLeader,
    expectedStatus: dataProvider.emptyStartDate.status,
    expectedResponse: dataProvider.emptyStartDate.response,
  },
  {
    description: "should return error for empty endDate",
    requestData: dataProvider.emptyEndDate.request as ICreateUpdateLeader,
    expectedStatus: dataProvider.emptyEndDate.status,
    expectedResponse: dataProvider.emptyEndDate.response,
  },
];
