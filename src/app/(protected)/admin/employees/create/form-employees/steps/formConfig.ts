export interface IFieldConfig {
  id: string;
  label: string;
  type: string;
  name: string;
  placeholder?: string;
  catalog?: string;
  keyValue?: string;
  inputProps?: object;
  display?: boolean;
  gridSize: { xs: number; sm: number; lg: number };
  options?: any[];
  format?: string;
}

const personalDataConfig: IFieldConfig[] = [
  {
    id: "name",
    label: "Nombre (s)",
    type: "text",
    name: "name",
    gridSize: { xs: 12, sm: 12, lg: 4 },
  },
  {
    id: "paternalLastName",
    label: "Apellido Paterno",
    type: "text",
    name: "paternalLastName",
    gridSize: { xs: 12, sm: 12, lg: 4 },
    options: [],
  },
  {
    id: "maternalLastName",
    label: "Apellido Materno",
    type: "text",
    name: "maternalLastName",
    gridSize: { xs: 12, sm: 12, lg: 4 },
  },
  {
    id: "birthday",
    label: "Fecha de nacimiento",
    type: "date",
    name: "birthday",
    gridSize: { xs: 12, sm: 12, lg: 4 },
  },
  {
    id: "rfc",
    label: "RFC",
    type: "text",
    name: "rfc",
    gridSize: { xs: 12, sm: 12, lg: 4 },
    format: "upperAlphaNum",
  },
  {
    id: "curp",
    label: "CURP",
    type: "text",
    name: "curp",
    gridSize: { xs: 12, sm: 12, lg: 4 },
    format: "upperAlphaNum",
  },
  {
    id: "genderId",
    label: "Género",
    type: "select",
    catalog: "gender",
    name: "genderId",
    gridSize: { xs: 12, sm: 12, lg: 4 },
    options: [],
  },
  {
    id: "maritalStatusId",
    label: "Estado Civil",
    type: "select",
    catalog: "marital-status",
    name: "maritalStatusId",
    gridSize: { xs: 12, sm: 12, lg: 4 },
    options: [],
  },
  {
    id: "schoolingId",
    label: "Escolaridad",
    type: "select",
    catalog: "schooling",
    name: "schoolingId",
    gridSize: { xs: 12, sm: 12, lg: 4 },
    options: [],
  },
  {
    id: "occupationId",
    label: "Ocupación",
    type: "select",
    catalog: "occupation",
    name: "occupationId",
    gridSize: { xs: 12, sm: 12, lg: 4 },
    options: [],
  },
  {
    id: "professionId",
    label: "Profesión",
    type: "select",
    catalog: "profession",
    name: "professionId",
    gridSize: { xs: 12, sm: 12, lg: 4 },
    options: [],
  },
  {
    id: "indetificationTypeId",
    label: "Tipo de identificacion",
    type: "select",
    catalog: "identification-type",
    name: "indetificationTypeId",
    gridSize: { xs: 12, sm: 12, lg: 4 },
    options: [],
  },
  {
    id: "identificationFolio",
    label: "Folio de identificacion",
    type: "text",
    name: "identificationFolio",
    gridSize: { xs: 12, sm: 12, lg: 4 },
    options: [],
  },
];

const hiringConfig: IFieldConfig[] = [
  {
    id: "startJobDate",
    label: "Fecha de inicio",
    type: "date",
    name: "startJobDate",
    gridSize: { xs: 12, sm: 12, lg: 4 },
  },
  {
    id: "endJobDate",
    label: "Fecha de terminacion",
    type: "date",
    name: "endJobDate",
    gridSize: { xs: 12, sm: 12, lg: 4 },
  },
  {
    id: "categoryId",
    label: "Categoría",
    placeholder: "Seleccione una Categoría",
    type: "selectCategory",
    catalog: "category",
    name: "categoryId",
    gridSize: { xs: 12, sm: 12, lg: 4 },
  },
  {
    id: "secretariaId",
    label: "Organismo público",
    type: "select",
    catalog: "secretarias",
    name: "secretariaId",
    gridSize: { xs: 12, sm: 12, lg: 4 },
    options: [],
  },
  {
    id: "direccionId",
    label: "Organo administrativo",
    type: "select",
    catalog: "direcciones",
    name: "direccionId",
    gridSize: { xs: 12, sm: 12, lg: 4 },
    options: [],
  },
  {
    id: "employeeTypeName",
    label: "Tipo de empleado",
    type: "select",
    keyValue: "name",
    catalog: "employee-type",
    name: "employeeTypeName",
    gridSize: { xs: 12, sm: 12, lg: 4 },
    options: [],
  },
  {
    id: "tradeUnionId",
    display: false,
    label: "Sindicato",
    type: "select",
    catalog: "trade-union",
    name: "tradeUnionId",
    gridSize: { xs: 12, sm: 12, lg: 4 },
    options: [],
  },
];

const locationConfig: IFieldConfig[] = [
  {
    id: "locationId",
    label: "Ubicación",
    placeholder: "Seleccione una ubicación",
    type: "select",
    name: "locationId",
    gridSize: { xs: 12, sm: 12, lg: 12 },
    options: [],
  },
];

const addressConfig: IFieldConfig[] = [
  {
    id: "addressLine1",
    label: "Calle",
    type: "text",
    name: "addressLine1",
    gridSize: { xs: 12, sm: 12, lg: 4 },
  },
  {
    id: "addressLine2",
    label: "Número de Casa",
    type: "text",
    format: "numbersOnly",
    inputProps: { maxLength: 7, autoComplete: "off" },
    name: "addressLine2",
    gridSize: { xs: 12, sm: 12, lg: 4 },
  },
  {
    id: "addressLine3",
    label: "Número de Departamento",
    type: "text",
    format: "numbersOnly",
    inputProps: { maxLength: 7, autoComplete: "off" },
    name: "addressLine3",
    gridSize: { xs: 12, sm: 12, lg: 4 },
  },
  {
    id: "postalCode",
    label: "Código Postal",
    type: "text",
    format: "numbersOnly",
    inputProps: { maxLength: 7, autoComplete: "off" },
    name: "postalCode",
    gridSize: { xs: 12, sm: 12, lg: 4 },
  },
  {
    id: "postalCodeSat",
    label: "Código Postal SAT",
    type: "text",
    format: "numbersOnly",
    inputProps: { maxLength: 7, autoComplete: "off" },
    name: "postalCodeSat",
    gridSize: { xs: 12, sm: 12, lg: 4 },
  },
  {
    id: "addressLine4",
    label: "Colonia",
    type: "text",
    name: "addressLine4",
    gridSize: { xs: 12, sm: 12, lg: 4 },
  },
  {
    id: "stateId",
    label: "Estado",
    type: "select",
    catalog: "state",
    name: "stateId",
    gridSize: { xs: 12, sm: 12, lg: 4 },
    options: [],
  },
  {
    id: "municipalityId",
    label: "Municipio",
    type: "select",
    catalog: "municipality",
    name: "municipalityId",
    gridSize: { xs: 12, sm: 12, lg: 4 },
    options: [],
  },
];

export const stepFormFields = {
  personalDataConfig,
  hiringConfig,
  locationConfig,
  addressConfig,
};
