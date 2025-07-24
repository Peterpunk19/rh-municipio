import { ValidateIncidentRulesTestCase } from "./ValidateIncidentRulesTestCase";
const validateIncidentRulesTestCase = new ValidateIncidentRulesTestCase();

export const dataProvider = {
  missingEmployeeId: validateIncidentRulesTestCase.create("missingEmployeeId"),
  invalidIncidentId: validateIncidentRulesTestCase.create("invalidIncidentId"),
  invalidDateFormat: validateIncidentRulesTestCase.create("invalidDateFormat"),
  valid: validateIncidentRulesTestCase.create("valid", 200),
};
