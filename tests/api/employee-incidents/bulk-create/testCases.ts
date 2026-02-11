import { dataProvider } from "./dataProvider";
import type { IEmployeeIncidentsBulkCreate } from "@/app/api/employee-incidents/types";

export const testCases = [
  {
    description: "should return invalid request",
    requestData: {} as IEmployeeIncidentsBulkCreate,
    expectedStatus: dataProvider.emptyParams.status,
    expectedResponse: dataProvider.emptyParams.response,
  },
  {
    description: "should return error for empty employee ids",
    requestData: dataProvider.emptyEmployeeIds.request as IEmployeeIncidentsBulkCreate,
    expectedStatus: dataProvider.emptyEmployeeIds.status,
    expectedResponse: dataProvider.emptyEmployeeIds.response,
  },
  {
    description: "should return error for empty incident type",
    requestData: dataProvider.emptyIncidentId.request as IEmployeeIncidentsBulkCreate,
    expectedStatus: dataProvider.emptyIncidentId.status,
    expectedResponse: dataProvider.emptyIncidentId.response,
  },
  {
    description: "should return error for empty start date",
    requestData: dataProvider.emptyStartDate.request as IEmployeeIncidentsBulkCreate,
    expectedStatus: dataProvider.emptyStartDate.status,
    expectedResponse: dataProvider.emptyStartDate.response,
  },
  {
    description: "should return error for empty end date",
    requestData: dataProvider.emptyEndDate.request as IEmployeeIncidentsBulkCreate,
    expectedStatus: dataProvider.emptyEndDate.status,
    expectedResponse: dataProvider.emptyEndDate.response,
  },
  {
    description: "should return error for invalid date range",
    requestData: dataProvider.invalidDateRange.request as IEmployeeIncidentsBulkCreate,
    expectedStatus: dataProvider.invalidDateRange.status,
    expectedResponse: dataProvider.invalidDateRange.response,
  },
  {
    description: "should return error for empty description",
    requestData: dataProvider.emptyDescription.request as IEmployeeIncidentsBulkCreate,
    expectedStatus: dataProvider.emptyDescription.status,
    expectedResponse: dataProvider.emptyDescription.response,
  },
  {
    description: "should return error for long description",
    requestData: dataProvider.longDescription.request as IEmployeeIncidentsBulkCreate,
    expectedStatus: dataProvider.longDescription.status,
    expectedResponse: dataProvider.longDescription.response,
  },
  {
    description: "should return error for long oficio",
    requestData: dataProvider.longOficio.request as IEmployeeIncidentsBulkCreate,
    expectedStatus: dataProvider.longOficio.status,
    expectedResponse: dataProvider.longOficio.response,
  },
  {
    description: "should return error for empty incident dates",
    requestData: dataProvider.emptyIncidentDates.request as IEmployeeIncidentsBulkCreate,
    expectedStatus: dataProvider.emptyIncidentDates.status,
    expectedResponse: dataProvider.emptyIncidentDates.response,
  },
  {
    description: "should return error when incident does not allow bulk creation",
    requestData: dataProvider.incidentNotAllowBulk.request as IEmployeeIncidentsBulkCreate,
    expectedStatus: dataProvider.incidentNotAllowBulk.status,
    expectedResponse: dataProvider.incidentNotAllowBulk.response,
  },
  {
    description: "should return error when permission validation fails",
    requestData: dataProvider.permissionDenied.request as IEmployeeIncidentsBulkCreate,
    expectedStatus: dataProvider.permissionDenied.status,
    expectedResponse: dataProvider.permissionDenied.response,
  },
  {
    description: "should successfully send message with valid data",
    requestData: dataProvider.validData.request as IEmployeeIncidentsBulkCreate,
    expectedStatus: dataProvider.validData.status,
    expectedResponse: dataProvider.validData.response,
  },
];
