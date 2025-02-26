export const request = {
  userIdNotnumber: {
    user_id: "a",
  },
  userIdZero: {
    user_id: 0,
  },
  userIdNegative: {
    user_id: -1,
  },
  userIdLong: {
    user_id: Number("9".repeat(16)),
  },
  userAlreadyDeactivate: {
    user_id: 1,
  },
  userIdNotFound: {
    user_id: 100000,
  },
  validData: {
    user_id: 2,
  },
};
