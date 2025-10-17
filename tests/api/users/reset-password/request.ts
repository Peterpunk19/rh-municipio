export const request = {
  validData: {
    userId: 2,
    password: "Temp1234",
  },
  notFoundUser: {
    userId: 999,
    password: "Temp1234",
  },
  adminUser: {
    userId: 1,
    password: "Temp1234",
  },
  invalidUserId: {
    userId: -1,
    password: "Temp1234",
  },
  missingUserId: {
    password: "Temp1234",
  },
  stringUserId: {
    userId: "invalid",
    password: "Temp1234",
  },
};
