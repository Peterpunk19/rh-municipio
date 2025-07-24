export interface RequestChangeData {
  folio: string;
  request_date: string;
  created_at: string;
  employee: {
    name: string;
    paternal_last_name: string;
    maternal_last_name: string;
    number_employee: string;
    rfc: string;
    curp: string;
    employee_hiring: Array<{
      direccion?: {
        display_name: string;
        secretaria?: {
          display_name: string;
        };
        director?: {
          name: string;
          paternal_last_name: string;
          maternal_last_name: string;
        };
      };
    }>;
  };
  request: {
    display_name: string;
  };
  description?: string;
  // Nuevos campos dinámicos
  rhDirector?: {
    id: number;
    name: string;
    paternal_last_name: string;
    maternal_last_name: string;
  } | null;
  destinationDirector?: {
    id: number;
    name: string;
    paternal_last_name: string;
    maternal_last_name: string;
  } | null;
  changeDate?: string | null;
  requestDetail?: {
    id: number;
    start_date: Date | null;
    end_date: Date | null;
    new_direccion: {
      id: number;
      name: string;
      display_name: string;
      secretaria: {
        id: number;
        name: string;
        display_name: string;
      };
    } | null;
  } | null;
  // Legacy para compatibilidad
  currentDirector?: {
    name: string;
    paternal_last_name: string;
    maternal_last_name: string;
  };
}

export interface RequestChangeTemplateProps {
  data: RequestChangeData;
}
