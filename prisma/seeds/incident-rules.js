const { generateRules } = require("./incident-rules-generator");

const months = [
  { start_date: 1, end_date: 6 },
  { start_date: 7, end_date: 12 },
];

const employeeTypes = {
  BASE_SINDICALIZADO: 1,
  BASE_NO_SINDICALIZADO: 2,
  CONFIANZA: 3,
  CONTRATO_LAUDO: 5,
};

const incident = {
  VACATIONS: 10,
};

const baseRules = [
  ...generateRules({
    employee_type_id: employeeTypes.BASE_SINDICALIZADO,
    incidentConfigs: [
      {
        incident_id: incident.VACATIONS,
        min_years: 1,
        max_years: 5,
        days: 10,
      },
    ],
    months: [months[0]],
  }),
  ...generateRules({
    employee_type_id: employeeTypes.BASE_SINDICALIZADO,
    incidentConfigs: [
      {
        incident_id: incident.VACATIONS,
        min_years: 1,
        max_years: 5,
        days: 10,
      },
    ],
    months: [months[1]],
  }),
  ...generateRules({
    employee_type_id: employeeTypes.BASE_SINDICALIZADO,
    incidentConfigs: [
      {
        incident_id: incident.VACATIONS,
        min_years: 6,
        days: 13,
      },
    ],
    months: [months[0]],
  }),
  ...generateRules({
    employee_type_id: employeeTypes.BASE_SINDICALIZADO,
    incidentConfigs: [
      {
        incident_id: incident.VACATIONS,
        min_years: 6,
        days: 13,
      },
    ],
    months: [months[1]],
  }),
];

const confianzaRules = [
  ...baseRules.map((rule) => ({
    ...rule,
    employee_type_id: employeeTypes.CONFIANZA,
  })),
];

const contratoLaudoRules = [
  ...generateRules({
    employee_type_id: employeeTypes.CONTRATO_LAUDO,
    incidentConfigs: [
      {
        incident_id: incident.VACATIONS,
        min_years: 6,
        days: 13,
      },
    ],
    months: [months[0]],
  }),
  ...generateRules({
    employee_type_id: employeeTypes.CONTRATO_LAUDO,
    incidentConfigs: [
      {
        incident_id: incident.VACATIONS,
        min_years: 6,
        days: 13,
      },
    ],
    months: [months[1]],
  }),
];

const baseNoSindicalizadoRules = [
  ...baseRules.map((rule) => ({
    ...rule,
    employee_type_id: employeeTypes.BASE_NO_SINDICALIZADO,
  })),
];

module.exports = [...baseRules, ...baseNoSindicalizadoRules, ...confianzaRules, ...contratoLaudoRules];
