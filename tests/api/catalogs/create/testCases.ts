import { ICatalogCreate } from "@/interfaces/Catalogs";
import { dataProvider } from "./dataProvider";

export const testCases = [
  {
    description: "should return invalid request",
    requestData: {} as ICatalogCreate,
    expectedStatus: dataProvider.invalidRequest.status,
    expectedResponse: dataProvider.invalidRequest.response,
  },
  {
    description: "should return error for empty name",
    requestData: dataProvider.emptyName.request as ICatalogCreate,
    expectedStatus: dataProvider.emptyName.status,
    expectedResponse: dataProvider.emptyName.response,
  },
  {
    description: "should return error for empty display name",
    requestData: dataProvider.emptyDisplayName.request as ICatalogCreate,
    expectedStatus: dataProvider.emptyDisplayName.status,
    expectedResponse: dataProvider.emptyDisplayName.response,
  },
  {
    description: "should return error for long name",
    requestData: dataProvider.longName.request as ICatalogCreate,
    expectedStatus: dataProvider.longName.status,
    expectedResponse: dataProvider.longName.response,
  },
  {
    description: "should return error for long display name",
    requestData: dataProvider.longDisplayName.request as ICatalogCreate,
    expectedStatus: dataProvider.longDisplayName.status,
    expectedResponse: dataProvider.longDisplayName.response,
  },
  {
    description: "should successfully create catalog with valid data",
    requestData: dataProvider.validData.request as ICatalogCreate,
    expectedStatus: dataProvider.validData.status,
    expectedResponse: dataProvider.validData.response,
  },
  {
    description: "should successfully create inactive catalog",
    requestData: dataProvider.validDataInactive.request as ICatalogCreate,
    expectedStatus: dataProvider.validDataInactive.status,
    expectedResponse: dataProvider.validDataInactive.response,
  },
];
