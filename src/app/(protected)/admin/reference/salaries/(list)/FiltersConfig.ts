import { setSelectedYear, fetchSalariesByYear } from "@/store/reference/salaries/SalaryConfigSlice";
import { AppDispatch } from "@/store/store";

interface ConfigYear {
  year: number;
}

export const getSalariesFiltersConfig = (
  configYears: { responseObject: ConfigYear[] } | undefined,
  dispatch: AppDispatch,
  selectedYear: number,
  currentYear: number,
) => {
  return [
    {
      id: "year",
      key: "year",
      label: "Año",
      placeholder: "Año",
      type: "select",
      options: (configYears?.responseObject || []).map((year: any) => ({
        value: year.year,
        label: year.year.toString(),
      })),
      onChange: (value: string | number) => {
        const year = value ? Number(value) : currentYear;
        dispatch(setSelectedYear(year));
        dispatch(fetchSalariesByYear({ year }));
      },
      redux: {
        entity: "salaries",
        action: "updateFilter",
        key: "year",
      },
      defaultValue: selectedYear ? String(selectedYear) : currentYear.toString(),
    },
  ];
};
