interface Employee {
  name: string;
  paternal_last_name: string;
  maternal_last_name: string;
  employee_hiring?: {
    direccion?: {
      display_name?: string;
      secretaria?: {
        display_name?: string;
      };
    };
    category?: {
      display_name?: string;
    };
  }[];
}

export interface IEmployeeIncidentDetails {
  employee: Employee;
  start_date: string;
  end_date: string;
  employee_incidents_status: [];
  incident: {
    display_name?: string;
  };
}
