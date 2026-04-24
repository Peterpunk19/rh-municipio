import { Chip, Stack } from "@mui/material";
import { useSelector, useDispatch } from "@/store/hooks";
import { RootState } from "@/store/store";
import { updateFilter } from "@/store/tables/FiltersSlice";
import type { FiltersConfig } from "@/interfaces/FiltersConfig";

const ActiveFiltersChips = ({
                              entity,
                              filters,
                            }: {
  entity: string;
  filters: FiltersConfig[];
}) => {
  const dispatch = useDispatch();
  const { values } = useSelector((state: RootState) => state.filters[entity]);

  const filtersMap = filters.reduce((acc, f) => {
    acc[f.key] = f;
    return acc;
  }, {} as Record<string, FiltersConfig>);

  const handleDelete = (key: string) => {
    dispatch(
      updateFilter({
        entity,
        key,
        value: "",
      })
    );
  };

  const entries = Object.entries(values || {}).filter(([key, v]) => {
    return v && filtersMap[key];
  });

  if (entries.length === 0) return null;

  return (
    <Stack
      direction="row"
      sx={{
        mb: 2,
        flexWrap: "wrap",
        gap: 1.5,
      }}
    >
      {entries.map(([key, value]) => {
        const filter = filtersMap[key];

        if (!filter) return null;

        const label = filter?.label || key;

        let displayValue = value;

        if (filter?.options) {
          const option = filter.options.find((o) => o.value === value);
          if (option) displayValue = option.label;
        }

        if (filter?.type === "date") {
          displayValue = new Date(value).toLocaleDateString("es-MX");
        }

        return (
          <Chip
            key={key}
            label={`${label}: ${displayValue}`}
            onDelete={() => handleDelete(key)}
            color="primary"
            variant="outlined"
          />
        );
      })}
    </Stack>
  );
};

export default ActiveFiltersChips;