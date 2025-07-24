export interface IIncidentsRulesFilters {
  page: number;
  limit: number;
  incidentId: number | string | undefined;
  employeeTypeId: number | string | undefined;
  search: string | null | undefined;
}
