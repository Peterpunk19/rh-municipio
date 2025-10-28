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
    description: "should return error for secretary not number",
    requestData: dataProvider.secretaryNotNumber.request,
    expectedStatus: dataProvider.secretaryNotNumber.status,
    expectedResponse: dataProvider.secretaryNotNumber.response,
  },
  {
    description: "should return error for secretary zero",
    requestData: dataProvider.secretaryZero.request,
    expectedStatus: dataProvider.secretaryZero.status,
    expectedResponse: dataProvider.secretaryZero.response,
  },
  {
    description: "should return error for secretary negative",
    requestData: dataProvider.secretaryNegative.request,
    expectedStatus: dataProvider.secretaryNegative.status,
    expectedResponse: dataProvider.secretaryNegative.response,
  },
  {
    description: "should return error for secretary too long",
    requestData: dataProvider.secretaryLong.request,
    expectedStatus: dataProvider.secretaryLong.status,
    expectedResponse: dataProvider.secretaryLong.response,
  },
  {
    description: "should return error for coordinator not number",
    requestData: dataProvider.coordinatorNotNumber.request,
    expectedStatus: dataProvider.coordinatorNotNumber.status,
    expectedResponse: dataProvider.coordinatorNotNumber.response,
  },
  {
    description: "should return error for coordinator zero",
    requestData: dataProvider.coordinatorZero.request,
    expectedStatus: dataProvider.coordinatorZero.status,
    expectedResponse: dataProvider.coordinatorZero.response,
  },
  {
    description: "should return error for coordinator negative",
    requestData: dataProvider.coordinatorNegative.request,
    expectedStatus: dataProvider.coordinatorNegative.status,
    expectedResponse: dataProvider.coordinatorNegative.response,
  },
  {
    description: "should return error for coordinator too long",
    requestData: dataProvider.coordinatorLong.request,
    expectedStatus: dataProvider.coordinatorLong.status,
    expectedResponse: dataProvider.coordinatorLong.response,
  },
  {
    description: "should return error for immediateResponsible not number",
    requestData: dataProvider.immediateResponsibleNotNumber.request,
    expectedStatus: dataProvider.immediateResponsibleNotNumber.status,
    expectedResponse: dataProvider.immediateResponsibleNotNumber.response,
  },
  {
    description: "should return error for immediateResponsible zero",
    requestData: dataProvider.immediateResponsibleZero.request,
    expectedStatus: dataProvider.immediateResponsibleZero.status,
    expectedResponse: dataProvider.immediateResponsibleZero.response,
  },
  {
    description: "should return error for immediateResponsible negative",
    requestData: dataProvider.immediateResponsibleNegative.request,
    expectedStatus: dataProvider.immediateResponsibleNegative.status,
    expectedResponse: dataProvider.immediateResponsibleNegative.response,
  },
  {
    description: "should return error for immediateResponsible too long",
    requestData: dataProvider.immediateResponsibleLong.request,
    expectedStatus: dataProvider.immediateResponsibleLong.status,
    expectedResponse: dataProvider.immediateResponsibleLong.response,
  },
];
