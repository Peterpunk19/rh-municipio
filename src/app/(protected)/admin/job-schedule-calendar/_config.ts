export type ShiftType = "weekdays" | "weekends" | "holidays";

export interface FormErrors {
  [key: string]: string | null;
}

export interface SelectedEmployee {
  id: number;
  label: string;
}
