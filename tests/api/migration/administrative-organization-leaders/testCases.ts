import { dataProvider } from "./dataProvider";

export const testCases = [
  {
    description: "should successfully import leaders with valid data",
    requestData: dataProvider.validData.request,
    expectedStatus: dataProvider.validData.status,
    expectedResponse: dataProvider.validData.response,
  },
  {
    description: "should successfully import leaders with some errors",
    requestData: dataProvider.validDataWithErrors.request,
    expectedStatus: dataProvider.validDataWithErrors.status,
    expectedResponse: dataProvider.validDataWithErrors.response,
  },
  {
    description: "should handle empty legacy database",
    requestData: dataProvider.emptyLegacyDatabase.request,
    expectedStatus: dataProvider.emptyLegacyDatabase.status,
    expectedResponse: dataProvider.emptyLegacyDatabase.response,
  },
  {
    description: "should return error for unauthorized user",
    requestData: dataProvider.unauthorizedUser.request,
    expectedStatus: dataProvider.unauthorizedUser.status,
    expectedResponse: dataProvider.unauthorizedUser.response,
  },
  {
    description: "should return error for unauthenticated user",
    requestData: dataProvider.unauthenticatedUser.request,
    expectedStatus: dataProvider.unauthenticatedUser.status,
    expectedResponse: dataProvider.unauthenticatedUser.response,
  },
  {
    description: "should return error when DATABASE_LEGACY_URL is missing",
    requestData: dataProvider.missingDatabaseUrl.request,
    expectedStatus: dataProvider.missingDatabaseUrl.status,
    expectedResponse: dataProvider.missingDatabaseUrl.response,
  },
  {
    description: "should return error when database connection fails",
    requestData: dataProvider.databaseConnectionError.request,
    expectedStatus: dataProvider.databaseConnectionError.status,
    expectedResponse: dataProvider.databaseConnectionError.response,
  },
];
