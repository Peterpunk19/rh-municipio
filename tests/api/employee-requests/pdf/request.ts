export const request = {
  idNotNumber: {
    id: "abc",
    isPDF: true,
    requestDate: "2025-07-09 00:00:00.000",
  },
  idZero: {
    id: 0,
    isPDF: true,
    requestDate: "2025-07-09 00:00:00.000",
  },
  idNegative: {
    id: -1,
    isPDF: true,
    requestDate: "2025-07-09 00:00:00.000",
  },
  idLong: {
    id: 999999999999999,
    isPDF: true,
    requestDate: "2025-07-09 00:00:00.000",
  },
  validData: {
    id: 1,
    isPDF: true,
    requestDate: "2025-07-09 00:00:00.000",
  },
  withoutPDFFlag: {
    id: 1,
    isPDF: false,
    requestDate: "2025-07-09 00:00:00.000",
  },
  withoutRequestDate: {
    id: 1,
    isPDF: true,
    requestDate: null,
  },
  incompleteData: {
    id: 1,
    isPDF: true,
    requestDate: "2025-07-09 00:00:00.000",
  },
};
