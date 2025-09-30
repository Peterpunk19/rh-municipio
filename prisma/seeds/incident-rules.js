const { generateRules } = require("./incident-rules-generator");
const employeeTypeData = require("./employee-type");
const incidentData = require("./incident");

const months = [
  { start_date: 1, end_date: 6 },
  { start_date: 7, end_date: 12 },
];

const monthlyMonths = [
  { start_date: 1, end_date: 1 },
  { start_date: 2, end_date: 2 },
  { start_date: 3, end_date: 3 },
  { start_date: 4, end_date: 4 },
  { start_date: 5, end_date: 5 },
  { start_date: 6, end_date: 6 },
  { start_date: 7, end_date: 7 },
  { start_date: 8, end_date: 8 },
  { start_date: 9, end_date: 9 },
  { start_date: 10, end_date: 10 },
  { start_date: 11, end_date: 11 },
  { start_date: 12, end_date: 12 },
];

const employeeTypes = {
  BASE_SINDICALIZADO: employeeTypeData.find((et) => et.name === "base_sindicalizado").id,
  BASE_NO_SINDICALIZADO: employeeTypeData.find((et) => et.name === "base_no_sindicalizado").id,
  CONFIANZA: employeeTypeData.find((et) => et.name === "confianza").id,
  CONTRATO_GASTO_CORRIENTE: employeeTypeData.find((et) => et.name === "contrato_gasto_corriente").id,
  CONTRATO_LAUDO: employeeTypeData.find((et) => et.name === "contrato_por_laudo").id,
  CONTRATO_FONDO_IV: employeeTypeData.find((et) => et.name === "contrato_fondo_iv").id,
  EVENTUAL: employeeTypeData.find((et) => et.name === "eventual").id,
  BASE_POR_LAUDO: employeeTypeData.find((et) => et.name === "base_por_laudo").id,
  CONFIANZA_FONDO_IV: employeeTypeData.find((et) => et.name === "confianza_fondo_iv").id,
  PENSIONADO: employeeTypeData.find((et) => et.name === "pensionado").id,
};

const incident = {
  INCAPACIDAD: incidentData.find((i) => i.name === "incapacidad").id,
  JUSTIFICACION_ENTRADA: incidentData.find((i) => i.name === "justificacion_entrada").id,
  JUSTIFICACION_SALIDA: incidentData.find((i) => i.name === "justificacion_salida").id,
  JUSTIFICACION_ENTRADA_SALIDA: incidentData.find((i) => i.name === "justificacion_entrada_salida").id,
  LACTANCIA: incidentData.find((i) => i.name === "lactancia").id,
  PATERNIDAD: incidentData.find((i) => i.name === "paternidad").id,
  PERMISO_ESPECIAL: incidentData.find((i) => i.name === "permiso_especial").id,
  PERMISO_ECONOMICO: incidentData.find((i) => i.name === "permiso_economico").id,
  PERMISO_SIN_GOCE: incidentData.find((i) => i.name === "permiso_sin_goce").id,
  VACACIONES: incidentData.find((i) => i.name === "vacaciones").id,
  COMISION: incidentData.find((i) => i.name === "comision").id,
  LICENCIA_MEDICA: incidentData.find((i) => i.name === "licencia_medica").id,
};

const paternityRules = [
  ...generateRules({
    employee_type_id: employeeTypes.BASE_SINDICALIZADO,
    incidentConfigs: [
      {
        incident_id: incident.PATERNIDAD,
        days: 21,
        allMonths: true,
      },
    ],
  }),
  ...generateRules({
    employee_type_id: employeeTypes.BASE_NO_SINDICALIZADO,
    incidentConfigs: [
      {
        incident_id: incident.PATERNIDAD,
        days: 21,
        allMonths: true,
      },
    ],
  }),
  ...generateRules({
    employee_type_id: employeeTypes.CONFIANZA,
    incidentConfigs: [
      {
        incident_id: incident.PATERNIDAD,
        days: 21,
        allMonths: true,
      },
    ],
  }),
  ...generateRules({
    employee_type_id: employeeTypes.CONTRATO_GASTO_CORRIENTE,
    incidentConfigs: [
      {
        incident_id: incident.PATERNIDAD,
        days: 21,
        allMonths: true,
      },
    ],
  }),
  ...generateRules({
    employee_type_id: employeeTypes.CONTRATO_LAUDO,
    incidentConfigs: [
      {
        incident_id: incident.PATERNIDAD,
        days: 21,
        allMonths: true,
      },
    ],
  }),
  ...generateRules({
    employee_type_id: employeeTypes.CONTRATO_FONDO_IV,
    incidentConfigs: [
      {
        incident_id: incident.PATERNIDAD,
        days: 21,
        allMonths: true,
      },
    ],
  }),
];

const licenciaMedicaRules = [
  ...generateRules({
    employee_type_id: employeeTypes.BASE_SINDICALIZADO,
    incidentConfigs: [
      {
        incident_id: incident.LICENCIA_MEDICA,
        days: 30,
        max_years: 1,
        allMonths: true,
      },
    ],
  }),
  ...generateRules({
    employee_type_id: employeeTypes.BASE_SINDICALIZADO,
    incidentConfigs: [
      {
        incident_id: incident.LICENCIA_MEDICA,
        days: 60,
        min_years: 1,
        max_years: 5,
        allMonths: true,
      },
    ],
  }),
  ...generateRules({
    employee_type_id: employeeTypes.BASE_SINDICALIZADO,
    incidentConfigs: [
      {
        incident_id: incident.LICENCIA_MEDICA,
        days: 90,
        min_years: 5,
        max_years: 10,
        allMonths: true,
      },
    ],
  }),
  ...generateRules({
    employee_type_id: employeeTypes.BASE_SINDICALIZADO,
    incidentConfigs: [
      {
        incident_id: incident.LICENCIA_MEDICA,
        days: 120,
        min_years: 10,
        allMonths: true,
      },
    ],
  }),
];

const baseRules = [
  ...generateRules({
    employee_type_id: employeeTypes.BASE_SINDICALIZADO,
    incidentConfigs: [
      {
        incident_id: incident.VACACIONES,
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
        incident_id: incident.VACACIONES,
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
        incident_id: incident.VACACIONES,
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
        incident_id: incident.VACACIONES,
        min_years: 6,
        days: 13,
      },
    ],
    months: [months[1]],
  }),
  ...generateRules({
    employee_type_id: employeeTypes.BASE_SINDICALIZADO,
    incidentConfigs: [
      {
        incident_id: incident.JUSTIFICACION_ENTRADA,
        days: 2,
      },
    ],
    months: monthlyMonths,
  }),
  ...generateRules({
    employee_type_id: employeeTypes.BASE_SINDICALIZADO,
    incidentConfigs: [
      {
        incident_id: incident.JUSTIFICACION_SALIDA,
        days: 2,
      },
    ],
    months: monthlyMonths,
  }),
  ...licenciaMedicaRules,
];

const confianzaRules = [
  ...baseRules.map((rule) => ({
    ...rule,
    employee_type_id: employeeTypes.CONFIANZA,
  })),
  ...generateRules({
    employee_type_id: employeeTypes.CONFIANZA,
    incidentConfigs: [
      {
        incident_id: incident.PERMISO_ECONOMICO,
        min_years: 1,
        days: 6,
        allMonths: true,
      },
    ],
  }),
  ...generateRules({
    employee_type_id: employeeTypes.CONFIANZA,
    incidentConfigs: [
      {
        incident_id: incident.PERMISO_ECONOMICO,
        days: 3,
      },
    ],
    months: monthlyMonths,
  }),
  ...licenciaMedicaRules.map((rule) => ({
    ...rule,
    employee_type_id: employeeTypes.CONFIANZA,
  })),
];

const contratoLaudoRules = [
  ...generateRules({
    employee_type_id: employeeTypes.CONTRATO_LAUDO,
    incidentConfigs: [
      {
        incident_id: incident.VACACIONES,
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
        incident_id: incident.VACACIONES,
        min_years: 6,
        days: 13,
      },
    ],
    months: [months[1]],
  }),
  ...generateRules({
    employee_type_id: employeeTypes.CONTRATO_LAUDO,
    incidentConfigs: [
      {
        incident_id: incident.JUSTIFICACION_ENTRADA,
        days: 2,
      },
    ],
    months: monthlyMonths,
  }),
  ...generateRules({
    employee_type_id: employeeTypes.CONTRATO_LAUDO,
    incidentConfigs: [
      {
        incident_id: incident.JUSTIFICACION_SALIDA,
        days: 2,
      },
    ],
    months: monthlyMonths,
  }),
  ...licenciaMedicaRules.map((rule) => ({
    ...rule,
    employee_type_id: employeeTypes.CONTRATO_LAUDO,
  })),
];

const baseNoSindicalizadoRules = [
  ...baseRules.map((rule) => ({
    ...rule,
    employee_type_id: employeeTypes.BASE_NO_SINDICALIZADO,
  })),
  ...generateRules({
    employee_type_id: employeeTypes.BASE_NO_SINDICALIZADO,
    incidentConfigs: [
      {
        incident_id: incident.PERMISO_ECONOMICO,
        days: 6,
        allMonths: true,
      },
    ],
  }),
  ...generateRules({
    employee_type_id: employeeTypes.BASE_NO_SINDICALIZADO,
    incidentConfigs: [
      {
        incident_id: incident.PERMISO_ECONOMICO,
        days: 3,
      },
    ],
    months: monthlyMonths,
  }),
  ...licenciaMedicaRules.map((rule) => ({
    ...rule,
    employee_type_id: employeeTypes.BASE_NO_SINDICALIZADO,
  })),
];

const contratoGastoCorrienteRules = [
  ...generateRules({
    employee_type_id: employeeTypes.CONTRATO_GASTO_CORRIENTE,
    incidentConfigs: [
      {
        incident_id: incident.JUSTIFICACION_ENTRADA,
        days: 2,
      },
    ],
    months: monthlyMonths,
  }),
  ...generateRules({
    employee_type_id: employeeTypes.CONTRATO_GASTO_CORRIENTE,
    incidentConfigs: [
      {
        incident_id: incident.JUSTIFICACION_SALIDA,
        days: 2,
      },
    ],
    months: monthlyMonths,
  }),
  ...licenciaMedicaRules.map((rule) => ({
    ...rule,
    employee_type_id: employeeTypes.CONTRATO_GASTO_CORRIENTE,
  })),
];

const contratoFondoIVRules = [
  ...generateRules({
    employee_type_id: employeeTypes.CONTRATO_FONDO_IV,
    incidentConfigs: [
      {
        incident_id: incident.JUSTIFICACION_ENTRADA,
        days: 2,
      },
    ],
    months: monthlyMonths,
  }),
  ...generateRules({
    employee_type_id: employeeTypes.CONTRATO_FONDO_IV,
    incidentConfigs: [
      {
        incident_id: incident.JUSTIFICACION_SALIDA,
        days: 2,
      },
    ],
    months: monthlyMonths,
  }),
  ...licenciaMedicaRules.map((rule) => ({
    ...rule,
    employee_type_id: employeeTypes.CONTRATO_FONDO_IV,
  })),
];

const baseSindicalizadoPermisoEconomico = [
  ...generateRules({
    employee_type_id: employeeTypes.BASE_SINDICALIZADO,
    incidentConfigs: [
      {
        incident_id: incident.PERMISO_ECONOMICO,
        days: 14,
        allMonths: true,
      },
    ],
  }),
  ...generateRules({
    employee_type_id: employeeTypes.BASE_SINDICALIZADO,
    incidentConfigs: [
      {
        incident_id: incident.PERMISO_ECONOMICO,
        days: 5,
      },
    ],
    months: monthlyMonths,
  }),
];

const contratoLaudoPermisoEconomico = [
  ...generateRules({
    employee_type_id: employeeTypes.CONTRATO_LAUDO,
    incidentConfigs: [
      {
        incident_id: incident.PERMISO_ECONOMICO,
        days: 6,
        allMonths: true,
      },
    ],
  }),
  ...generateRules({
    employee_type_id: employeeTypes.CONTRATO_LAUDO,
    incidentConfigs: [
      {
        incident_id: incident.PERMISO_ECONOMICO,
        days: 3,
      },
    ],
    months: monthlyMonths,
  }),
];

module.exports = [
  ...paternityRules,
  ...baseRules,
  ...baseSindicalizadoPermisoEconomico,
  ...baseNoSindicalizadoRules,
  ...confianzaRules,
  ...contratoLaudoRules,
  ...contratoLaudoPermisoEconomico,
  ...contratoGastoCorrienteRules,
  ...contratoFondoIVRules,
];
