export interface IFieldConfig {
  id: string;
  label: string;
  type: string;
  name: string;
  placeholder?: string;
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
    name: "genderId",
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
    type: "select",
    name: "categoryId",
    gridSize: { xs: 12, sm: 12, lg: 4 },
  },
  {
    id: "secretariaId",
    label: "Secretarías",
    type: "select",
    name: "secretariaId",
    gridSize: { xs: 12, sm: 12, lg: 4 },
    options: [],
  },
  {
    id: "direccionId",
    label: "Direcciones",
    type: "select",
    name: "direccionId",
    gridSize: { xs: 12, sm: 12, lg: 4 },
    options: [],
  },
  {
    id: "departamentoId",
    label: "Departamentos",
    type: "select",
    name: "departamentoId",
    gridSize: { xs: 12, sm: 12, lg: 4 },
    options: [],
  },
  {
    id: "employeeTypeId",
    label: "Tipo de empleado",
    type: "select",
    name: "employeeTypeId",
    gridSize: { xs: 12, sm: 12, lg: 4 },
    options: [],
  },
  {
    id: "payrollId",
    label: "Tipo de nómina",
    type: "select",
    name: "payrollId",
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

export const stepFormFields = {
  personalDataConfig,
  hiringConfig,
  locationConfig,
};
