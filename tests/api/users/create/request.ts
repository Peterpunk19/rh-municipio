export const request = {
  validData: {
    username: "carloszh04",
    password: "Password123*",
    role_id: 1,
  },
  emptyUsername: {
    username: "",
    password: "Pass123*",
    role_id: 3,
  },
  longUsername: {
    username: "Minombredeusuarioesdemasiadolargo",
    password: "Pass123*",
    role_id: 3,
  },
  duplicatedUsername: {
    username: "DUPLICATED",
    password: "Pass123*",
    role_id: 1,
  },
  invalidUuid: {
    uuid: "1",
    username: "carloszh",
    password: "Pass123*",
    role_id: 3,
  },
  duplicatedUuid: {
    uuid: "62ae6298-dd74-4fab-9952-96e44d97fad1",
    username: "carloszh",
    password: "Pass123*",
    role_id: 1,
  },
  invalidEmployeeId: {
    username: "carloszh",
    password: "Pass123*",
    employee_id: "A",
    role_id: 3,
  },
  notFoundEmployeeId: {
    username: "carloszh",
    password: "Pass123*",
    employee_id: 9999,
    role_id: 3,
  },
  duplicatedEmployeeId: {
    username: "carloszh",
    password: "Pass123*",
    employee_id: 6,
    role_id: 3,
  },
  emptyPassword: {
    username: "carloszh",
    password: "",
    role_id: 3,
  },
  shortPassword: {
    username: "carloszh",
    password: "Pa1*",
    role_id: 3,
  },
  longPassword: {
    username: "carloszh",
    password: "Micontrasenaesdemasiadalarga12345*",
    role_id: 3,
  },
  upperCasePassword: {
    username: "carloszh",
    password: "password1*",
    role_id: 3,
  },
  lowerCasePassword: {
    username: "carloszh",
    password: "PASWORD1*",
    role_id: 3,
  },
  oneNumberPassword: {
    username: "carloszh",
    password: "Password*",
    role_id: 3,
  },
  oneSymbolPassword: {
    username: "carloszh",
    password: "Password1",
    role_id: 3,
  },
  emptyRoleId: {
    username: "carloszh",
    password: "Pass123*",
    role_id: "",
  },
  notFoundRole: {
    username: "carloszh",
    password: "Pass123*",
    role_id: 999,
  },
};
