export interface JobScheduleEmployee {
  id: number;
  employee_id: number;
  start_day_id: number;
  end_day_id: number;
  start_hour_id: number;
  end_hour_id: number;
  active: boolean;
  created_at: Date | null;
  updated_at: Date | null;
  start_day: {
    id: number;
    name: string;
  };
  end_day: {
    id: number;
    name: string;
  };
  start_hour: {
    id: number;
    hour: string;
  };
  end_hour: {
    id: number;
    hour: string;
  };
} 