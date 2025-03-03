export interface FormErrors {
    employeeId?: string;
    incidentId?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
    [key: string]: string | undefined;
  }
  
  export const initialFormData = {
    employeeId: "0",
    incidentId: "0",
    startDate: "",
    endDate: "",
    description: "",
  };
  