export interface ICatalogFilters {
  page: number | string | undefined;
  limit: number | string | undefined;
  search: string | null | undefined;
  year?: number | string | undefined;
  secretaria_id?: number | string | undefined;
  active?: number | string | undefined;
}
