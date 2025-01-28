interface IFieldConfig {
  id: string;
  label: string;
  type: string;
  name: string;
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

export const stepFormFields = {
  personalDataConfig,
};
