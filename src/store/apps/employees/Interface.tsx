export interface IEmployeeState {
  values: {
    name: string;
    paternalLastName: string;
    maternalLastName: string;
    birthday: string;
    rfc: string;
    curp: string;
    genderId: string;
  };
  errors: {
    name: string;
    paternalLastName: string;
    maternalLastName: string;
    birthday: string;
    rfc: string;
    curp: string;
    genderId: string;
  };
}