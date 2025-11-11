import { buildWhereClause } from "@/common/utils";
import { ICatalogFilters } from "@/interfaces/Catalogs";

interface CatalogQueryConfig {
  model: any;
  filters?: ICatalogFilters;
  filterMappings?: Record<string, any>;
  searchMappings?: Array<{ path: string[]; operators: string[] }>;
  orderBy?: any;
  select?: any;
}

export async function executeCatalog({
  model,
  filters,
  filterMappings = { active: "active" },
  searchMappings = [{ path: ["display_name"], operators: ["contains"] }],
  orderBy = { display_name: "asc" },
  select,
}: CatalogQueryConfig) {
  const whereClause = filters ? await buildWhereClause(filterMappings, filters, searchMappings) : {};

  const queryOptions: any = {
    where: whereClause,
    orderBy,
  };

  if (select) {
    queryOptions.select = select;
  }

  if (filters?.page && filters?.limit) {
    const skip = (Number(filters.page) - 1) * Number(filters.limit);
    const take = Number(filters.limit);

    if (skip > 0) queryOptions.skip = skip;
    if (take > 0) queryOptions.take = take;
  }

  const data = await model.findMany(queryOptions);

  if (filters?.page && filters?.limit) {
    const total = await model.count({ where: whereClause });

    Object.assign(data, {
      total,
      page: Number(filters.page),
      limit: Number(filters.limit),
    });
  }

  return data;
}
