import { dataProvider } from "./dataProvider";

export const testCases = [
  {
    description: "should return error for id not number",
    requestData: dataProvider.idNotNumber.request,
    expectedStatus: dataProvider.idNotNumber.status,
    expectedResponse: dataProvider.idNotNumber.response,
  },
  {
    description: "should return error for id zero",
    requestData: dataProvider.idZero.request,
    expectedStatus: dataProvider.idZero.status,
    expectedResponse: dataProvider.idZero.response,
  },
  {
    description: "should return error for id negative",
    requestData: dataProvider.idNegative.request,
    expectedStatus: dataProvider.idNegative.status,
    expectedResponse: dataProvider.idNegative.response,
  },
  {
    description: "should return error for id too long",
    requestData: dataProvider.idLong.request,
    expectedStatus: dataProvider.idLong.status,
    expectedResponse: dataProvider.idLong.response,
  },
  {
    description: "should successfully get PDF data with valid data",
    requestData: dataProvider.validData.request,
    expectedStatus: dataProvider.validData.status,
    expectedResponse: dataProvider.validData.response,
  },
  {
    description: "should successfully get PDF data without PDF flag",
    requestData: dataProvider.withoutPDFFlag.request,
    expectedStatus: dataProvider.withoutPDFFlag.status,
    expectedResponse: dataProvider.withoutPDFFlag.response,
  },
  {
    description: "should successfully get PDF data without request date",
    requestData: dataProvider.withoutRequestDate.request,
    expectedStatus: dataProvider.withoutRequestDate.status,
    expectedResponse: dataProvider.withoutRequestDate.response,
  },
  {
    description: "should return error for incomplete data",
    requestData: dataProvider.incompleteData.request,
    expectedStatus: dataProvider.incompleteData.status,
    expectedResponse: dataProvider.incompleteData.response,
  },
];
