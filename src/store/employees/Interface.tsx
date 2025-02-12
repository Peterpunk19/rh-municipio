export interface IEmployeeState {
  values: {
    name: string;
    paternalLastName: string;
    maternalLastName: string;
    birthday: string;
    rfc: string;
    curp: string;
    genderId: string;
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    addressLine4: string;
    postalCode: string;
    postalCodeSat: string;
    stateId: string;
    municipalityId: string;
    startJobDate: string;
    endJobDate: string;
    categoryId: string;
    employeeTypeId: string;
    secretariaId: string;
    direccionId: string;
  };
  errors: {
    name: string;
    paternalLastName: string;
    maternalLastName: string;
    birthday: string;
    rfc: string;
    curp: string;
    genderId: string;
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    addressLine4: string;
    postalCode: string;
    postalCodeSat: string;
    municipalityId: string;
    startJobDate: string;
    endJobDate: string;
    categoryId: string;
    employeeTypeId: string;
    secretariaId: string;
    direccionId: string;
  };
  helperText: {
    salary: string;
  };
}
