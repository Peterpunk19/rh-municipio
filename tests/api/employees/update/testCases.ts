import { dataProvider } from "./dataProvider";
import type { IEmployee } from "@/app/api/employees/interface";

export const testCases = [
  {
    description: "should successfully update employee with valid data",
    requestData: dataProvider.validData.request as IEmployee,
    expectedStatus: dataProvider.validData.status,
    expectedResponse: dataProvider.validData.response,
  },
  {
    description: "should return error for empty numberEmployee",
    requestData: dataProvider.emptyNumberEmployee.request,
    expectedStatus: dataProvider.emptyNumberEmployee.status,
    expectedResponse: dataProvider.emptyNumberEmployee.response,
  },
  {
    description: "should return error for empty name",
    requestData: dataProvider.emptyName.request,
    expectedStatus: dataProvider.emptyName.status,
    expectedResponse: dataProvider.emptyName.response,
  },
  {
    description: "should return error for empty paternalLastName",
    requestData: dataProvider.emptyPaternalLastName.request,
    expectedStatus: dataProvider.emptyPaternalLastName.status,
    expectedResponse: dataProvider.emptyPaternalLastName.response,
  },
  {
    description: "should return error for empty maternalLastName",
    requestData: dataProvider.emptyMaternalLastName.request,
    expectedStatus: dataProvider.emptyMaternalLastName.status,
    expectedResponse: dataProvider.emptyMaternalLastName.response,
  },
  {
    description: "should return error for empty birthday",
    requestData: dataProvider.emptyBirthday.request,
    expectedStatus: dataProvider.emptyBirthday.status,
    expectedResponse: dataProvider.emptyBirthday.response,
  },
  {
    description: "should return error for long numberEmployee",
    requestData: dataProvider.longNumberEmployee.request,
    expectedStatus: dataProvider.longNumberEmployee.status,
    expectedResponse: dataProvider.longNumberEmployee.response,
  },
  {
    description: "should return error for long name",
    requestData: dataProvider.longName.request,
    expectedStatus: dataProvider.longName.status,
    expectedResponse: dataProvider.longName.response,
  },
  {
    description: "should return error for duplicated RFC or CURP",
    requestData: dataProvider.duplicatedRfcCurp.request as IEmployee,
    expectedStatus: dataProvider.duplicatedRfcCurp.status,
    expectedResponse: dataProvider.duplicatedRfcCurp.response,
  },
  {
    description: "should return error for empty addressLine1",
    requestData: dataProvider.emptyAddressLine1.request,
    expectedStatus: dataProvider.emptyAddressLine1.status,
    expectedResponse: dataProvider.emptyAddressLine1.response,
  },
  {
    description: "should return error for empty postalCode",
    requestData: dataProvider.emptyPostalCode.request,
    expectedStatus: dataProvider.emptyPostalCode.status,
    expectedResponse: dataProvider.emptyPostalCode.response,
  },
  {
    description: "should return error for empty municipalityId",
    requestData: dataProvider.emptyMunicipalityId.request,
    expectedStatus: dataProvider.emptyMunicipalityId.status,
    expectedResponse: dataProvider.emptyMunicipalityId.response,
  },
  {
    description: "should return error for empty categoryId",
    requestData: dataProvider.emptyCategoryId.request,
    expectedStatus: dataProvider.emptyCategoryId.status,
    expectedResponse: dataProvider.emptyCategoryId.response,
  },
  {
    description: "should return error for empty employeeTypeName",
    requestData: dataProvider.emptyEmployeeTypeName.request,
    expectedStatus: dataProvider.emptyEmployeeTypeName.status,
    expectedResponse: dataProvider.emptyEmployeeTypeName.response,
  },
];
