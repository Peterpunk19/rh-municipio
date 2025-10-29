export interface LegacyLeaders {
  direccion_display_name: string;
  director_number_employee: number | string;
  responsible_number_employee: number | string;
  start_date: string;
  end_date: string;
}

export interface ImportResultLeaders {
  success: boolean;
  imported: number;
  skipped: number;
  total: number;
  errors: Array<any>;
}
