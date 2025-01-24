export const validationMessages = {
  required: (field: string) => `${field} es requerido`,
  maxLength: (field: string, max: number) => `${field} no puede exceder de ${max} caracteres`,
  minLength: (field: string, min: number) => `${field} debe contener al menos ${min} caracteres`,
  invalidFormat: (field: string) => `Formato de ${field} inválido`,
  invalidaFormat: (field: string) => `Formato de ${field} inválida`,
  invalidDate: (field: string) => `${field} es inválida`,
  email: "Dirección de correo inválida",
  oneLowercaseLetter: (field: string) => `${field} debe contener al menos una letra minúscula`,
  oneUppercaseLetter: (field: string) => `${field} debe contener al menos una letra mayúscula`,
  oneSymbol: (field: string) => `${field} must contain at least one of the following symbols [!@#$%^&*,._-=?]`,
  oneNumber: (field: string) => `${field} must contain at least one number`,
  number: (field: string) => `${field} debe ser un número`,
};
