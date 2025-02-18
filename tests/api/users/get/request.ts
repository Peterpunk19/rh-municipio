export const request = {
  limitNotnumber: {
    limit: "a",
    page: 1,
    role_id: 1,
    active: true,
  },
  limitZero: {
    limit: 0,
    page: 1,
    role_id: 1,
    active: true,
  },
  limitNegative: {
    limit: -1,
    page: 1,
    role_id: 1,
    active: true,
  },
  pageNotnumber: {
    limit: 20,
    page: "a",
    role_id: 1,
    active: true,
  },
  pageZero: {
    limit: 20,
    page: 0,
    role_id: 1,
    active: true,
  },
  pageNegative: {
    limit: 20,
    page: -1,
    role_id: 1,
    active: true,
  },
  roleIdNotNumber: {
    limit: 20,
    page: 1,
    role_id: "a",
    active: true,
  },
  roleIdZero: {
    limit: 20,
    page: 1,
    role_id: 0,
    active: true,
  },
  roleIdNegative: {
    limit: 20,
    page: 1,
    role_id: -1,
    active: true,
  },
  activeNotBoolean: {
    limit: 20,
    page: 1,
    role_id: 1,
    active: "a",
  },
  activeAsNumber: {
    limit: 20,
    page: 1,
    role_id: 1,
    active: 1,
  },
  validData: {
    limit: 20,
    page: 1,
    role_id: 1,
    active: true,
  },
};
