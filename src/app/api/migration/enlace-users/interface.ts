export interface LegacyEnlaceUser {
  Username: string;
  idSecretaria: number;
  NumeroEmpleado: number | string;
  Secretaria: string;
  Activo: number;
  StatusEmployee: string;
}

export interface ImportResult {
  success: boolean;
  imported: number;
  skipped: number;
  total: number;
  errors: Array<{ numero_empleado: string | number; reason: string }>;
}
