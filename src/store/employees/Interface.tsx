export interface IEmployeeState {
  values: {
    name: string;
    paternalLastName: string;
    maternalLastName: string;
    birthday: string;
    rfc: string;
    curp: string;
    genderId: string;
    startJobDate: string;
    endJobDate: string;
    categoryId: string;
    employeeTypeId: string;
    secretariaId: string;
    direccionId: string;
    departamentoId: string;
    payrollId: string;
    locationId: string;
  };
  errors: {
    name: string;
    paternalLastName: string;
    maternalLastName: string;
    birthday: string;
    rfc: string;
    curp: string;
    genderId: string;
    startJobDate: string;
    endJobDate: string;
    categoryId: string;
    employeeTypeId: string;
    secretariaId: string;
    direccionId: string;
    departamentoId: string;
    payrollId: string;
    locationId: string;
  };
}