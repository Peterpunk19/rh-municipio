export interface IEmployeesRequestsState {
  employeeRequests: any[];
  search: string;
  sortBy: string;
  total: number;
  page: number;
  limit: number;
  filters: {
    request_id: number;
    request_status_id: number;
    created_at: string;
    request_date: string;
  };
  emptyMessage: string;
  error: string;
}
