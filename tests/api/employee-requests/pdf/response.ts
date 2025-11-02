export const response = {
  idNotNumber: {
    success: false,
    message: "ID de solicitud inválido",
    responseObject: {},
    statusCode: 400,
  },
  idZero: {
    success: false,
    message: "Solicitud no encontrada",
    responseObject: {},
    statusCode: 404,
  },
  idNegative: {
    success: false,
    message: "Solicitud no encontrada",
    responseObject: {},
    statusCode: 404,
  },
  idLong: {
    success: false,
    message: "Solicitud no encontrada",
    responseObject: {},
    statusCode: 404,
  },
  validData: {
    success: true,
    message: "Datos de solicitud obtenidos exitosamente",
    responseObject: {
      folio: "000001",
      request_date: "09/07/2025",
      created_at: "09/07/2025",
      employee: {
        name: "JUAN",
        paternal_last_name: "PEREZ",
        maternal_last_name: "GARCIA",
        number_employee: "123456",
        rfc: "PEGJ850101ABC",
        curp: "PEGJ850101HCCRNN01",
        employee_hiring: [
          {
            direccion: {
              display_name: "DIRECCIÓN DE RECURSOS HUMANOS",
              secretaria: {
                display_name: "OFICIALÍA MAYOR",
              },
            },
          },
        ],
        employee_attendance_type: {
          attendance: {
            display_name: "RELOJ DIGITAL",
          },
        },
        job_schedule_employee: [],
      },
      request: {
        display_name: "Cambio de Adscripción",
      },
      description: "Solicitud de cambio de adscripción por necesidades del servicio",
      rhDirector: {
        id: 1,
        name: "CRISTOBAL",
        paternal_last_name: "FLORES",
        maternal_last_name: "LÓPEZ",
      },
      destinationDirector: {
        id: 2,
        name: "MARIA",
        paternal_last_name: "GONZALEZ",
        maternal_last_name: "MARTINEZ",
      },
      changeDate: "15/07/2025",
      leaveDate: "",
      requestDetail: {
        id: 1,
        start_date: "2025-07-15T00:00:00.000Z",
        end_date: null,
        new_direccion: {
          id: 5,
          name: "DIRECCION_PARTICIPACION_CIUDADANA",
          display_name: "DIRECCIÓN DE PARTICIPACIÓN CIUDADANA",
          secretaria: {
            id: 2,
            name: "SECRETARIA_GENERAL",
            display_name: "SECRETARÍA GENERAL",
          },
        },
      },
    },
    statusCode: 200,
  },
  withoutPDFFlag: {
    success: true,
    message: "Datos de solicitud obtenidos exitosamente",
    responseObject: {
      folio: "000001",
      request_date: "09/07/2025",
      created_at: "09/07/2025",
      employee: {
        name: "JUAN",
        paternal_last_name: "PEREZ",
        maternal_last_name: "GARCIA",
        number_employee: "123456",
        rfc: "PEGJ850101ABC",
        curp: "PEGJ850101HCCRNN01",
        employee_hiring: [
          {
            direccion: {
              display_name: "DIRECCIÓN DE RECURSOS HUMANOS",
              secretaria: {
                display_name: "OFICIALÍA MAYOR",
              },
            },
          },
        ],
        employee_attendance_type: {
          attendance: {
            display_name: "RELOJ DIGITAL",
          },
        },
        job_schedule_employee: [],
      },
      request: {
        display_name: "Cambio de Adscripción",
      },
      description: "Solicitud de cambio de adscripción por necesidades del servicio",
      rhDirector: {
        id: 1,
        name: "CRISTOBAL",
        paternal_last_name: "FLORES",
        maternal_last_name: "LÓPEZ",
      },
      destinationDirector: {
        id: 2,
        name: "MARIA",
        paternal_last_name: "GONZALEZ",
        maternal_last_name: "MARTINEZ",
      },
      changeDate: "15/07/2025",
      leaveDate: "",
      requestDetail: {
        id: 1,
        start_date: "2025-07-15T00:00:00.000Z",
        end_date: null,
        new_direccion: {
          id: 5,
          name: "DIRECCION_PARTICIPACION_CIUDADANA",
          display_name: "DIRECCIÓN DE PARTICIPACIÓN CIUDADANA",
          secretaria: {
            id: 2,
            name: "SECRETARIA_GENERAL",
            display_name: "SECRETARÍA GENERAL",
          },
        },
      },
    },
    statusCode: 200,
  },
  withoutRequestDate: {
    success: true,
    message: "Datos de solicitud obtenidos exitosamente",
    responseObject: {
      folio: "000001",
      request_date: "09/07/2025",
      created_at: "09/07/2025",
      employee: {
        name: "JUAN",
        paternal_last_name: "PEREZ",
        maternal_last_name: "GARCIA",
        number_employee: "123456",
        rfc: "PEGJ850101ABC",
        curp: "PEGJ850101HCCRNN01",
        employee_hiring: [
          {
            direccion: {
              display_name: "DIRECCIÓN DE RECURSOS HUMANOS",
              secretaria: {
                display_name: "OFICIALÍA MAYOR",
              },
            },
          },
        ],
        employee_attendance_type: {
          attendance: {
            display_name: "RELOJ DIGITAL",
          },
        },
        job_schedule_employee: [],
      },
      request: {
        display_name: "Cambio de Adscripción",
      },
      description: "Solicitud de cambio de adscripción por necesidades del servicio",
      rhDirector: {
        id: 1,
        name: "CRISTOBAL",
        paternal_last_name: "FLORES",
        maternal_last_name: "LÓPEZ",
      },
      destinationDirector: {
        id: 2,
        name: "MARIA",
        paternal_last_name: "GONZALEZ",
        maternal_last_name: "MARTINEZ",
      },
      changeDate: "15/07/2025",
      leaveDate: "",
      requestDetail: {
        id: 1,
        start_date: "2025-07-15T00:00:00.000Z",
        end_date: null,
        new_direccion: {
          id: 5,
          name: "DIRECCION_PARTICIPACION_CIUDADANA",
          display_name: "DIRECCIÓN DE PARTICIPACIÓN CIUDADANA",
          secretaria: {
            id: 2,
            name: "SECRETARIA_GENERAL",
            display_name: "SECRETARÍA GENERAL",
          },
        },
      },
    },
    statusCode: 200,
  },
  incompleteData: {
    success: false,
    message: "Datos incompletos para generar PDF",
    responseObject: {},
    statusCode: 404,
  },
};
