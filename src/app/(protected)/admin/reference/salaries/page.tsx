"use client";

import { useEffect, useCallback, useState, useRef, useMemo } from "react";
import {
  Box,
  CircularProgress,
  Paper,
  Input,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import { EditableTable } from "@/components/tables/EditableTable";
import ParentCard from "@/components/shared/cards/ParentCard";
import EnhancedTableToolbar from "@/components/tables/TableFilters";
import { useSelector, useDispatch } from "@/store/hooks";
import { getSalariesFiltersConfig } from "./(list)/FiltersConfig";
import type { RootState } from "@/store/store";
import {
  setSelectedYear,
  setError,
  fetchConfigYears,
  fetchSalariesByYear,
  saveSalaryByYear,
  setTableData,
} from "@/store/reference/salaries/SalaryConfigSlice";
import { MAX_SALARY } from "@/common/constants/Salaries";
import AppAlert from "@/components/shared/alerts/AppAlert";

const title = "Configuración de Salarios";

const BCrumb = [
  {
    to: "/admin/reference/salaries",
    title: "Configuración de Salarios",
  },
];

export function MyCurrencyMX(props: any) {
  const { onChange, ...rest } = props;
  return (
    <NumericFormat
      {...rest}
      thousandSeparator=","
      decimalSeparator="."
      decimalScale={2}
      fixedDecimalScale
      allowNegative={false}
      prefix="$"
      isAllowed={(vals) => (vals.floatValue === undefined ? true : vals.floatValue <= MAX_SALARY)}
      onValueChange={(values) => {
        const val = values.floatValue;
        if (val === undefined || val === null) {
          onChange?.(null);
        } else if (val <= MAX_SALARY) {
          onChange?.(val);
        } else {
          onChange?.(MAX_SALARY);
        }
      }}
    />
  );
}

export default function Salaries() {
  const dispatch = useDispatch();
  const {
    loading,
    error,
    selectedYear,
    catalogs: { configYears, employeeTypes },
    tableData,
    values,
  } = useSelector((state) => state.salaryConfig);

  const { total, emptyMessage } = useSelector((state: RootState) => state.salaries);

  const currentYear = new Date().getFullYear();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const tableContainerRef = useRef<any>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const pendingResolveRef = useRef<any>(null);
  const pendingRowRef = useRef<any>(null);

  const { values: salariesFilterValues, searchTerm } = useSelector(
    (state: RootState) => state.filters.salaries || { values: {}, searchTerm: "" },
  );

  const filtersConfig = useCallback(() => {
    return getSalariesFiltersConfig(configYears, dispatch, selectedYear || currentYear, currentYear);
  }, [configYears, dispatch, selectedYear, currentYear]);

  const loadSalaries = useCallback(
    async (year: number) => {
      await dispatch<any>(fetchSalariesByYear({ year }));
    },
    [dispatch],
  );

  const loadInitialData = useCallback(async () => {
    try {
      const [yearsResponse] = await Promise.all([dispatch<any>(fetchConfigYears())]);

      const years = Array.isArray(yearsResponse) ? yearsResponse : [];

      const sortedYears = [...years].sort((a: any, b: any) => b.year - a.year);
      const currentYearInList = sortedYears.find((y: any) => y.year === currentYear);
      const yearToSelect = currentYearInList || sortedYears[0];

      if (yearToSelect) {
        dispatch(setSelectedYear(yearToSelect.year));
        await loadSalaries(yearToSelect.year);
      } else if (sortedYears.length > 0) {
        dispatch(setSelectedYear(sortedYears[0].year));
        await loadSalaries(sortedYears[0].year);
      } else {
        dispatch(setSelectedYear(currentYear));
        await loadSalaries(currentYear);
      }
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  }, [dispatch, currentYear, loadSalaries]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const filteredData = useMemo(() => {
    if (!tableData) return [];
    let result = tableData;

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter((row: any) => row.category_name?.toLowerCase().includes(lowerSearch));
    }

    return result;
  }, [tableData, searchTerm]);

  useEffect(() => {
    if (selectedYear !== null) {
      loadSalaries(selectedYear);
    }
  }, [selectedYear, loadSalaries]);

  const performSave = async (rowData: any) => {
    try {
      if (!selectedYear) {
        throw new Error("No se ha seleccionado un año de configuración");
      }

      const selectedConfigYear = configYears?.responseObject?.find(
        (year: any) => typeof year === "object" && "year" in year && year.year === selectedYear,
      ) as { id: number; year: number } | undefined;

      if (!selectedConfigYear) {
        throw new Error(`No se encontró la configuración para el año ${selectedYear}`);
      }

      const originalRow = (tableData || []).find((r: any) => r.id === rowData.id) || {};
      const updatedColumns = Object.keys(rowData).filter((key) => {
        if (!key.startsWith("type_")) return false;
        const newVal = rowData[key];
        const oldVal = originalRow[key];
        return newVal !== undefined && newVal !== oldVal;
      });

      if (updatedColumns.length === 0) {
        throw new Error("No se encontraron datos de salario para guardar");
      }

      const savePromises = updatedColumns.map(
        async (columnKey): Promise<{ columnKey: string; saved: any; salaryValue: number | null }> => {
          const employeeTypeId = parseInt(columnKey.replace("type_", ""), 10);
          let salaryValue = rowData[columnKey];
          if (typeof salaryValue !== "number") {
            const coerced = Number(salaryValue);
            salaryValue = Number.isFinite(coerced) ? coerced : null;
          }

          if (salaryValue === null || salaryValue === undefined) {
            return { columnKey, saved: null, salaryValue: null };
          }

          if (Number(salaryValue) > MAX_SALARY) {
            throw new Error(
              `El salario no puede exceder $${MAX_SALARY.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            );
          }

          const payload = {
            id: rowData[`${columnKey}_id`] || null,
            category_id: rowData.category_id,
            employee_type_id: employeeTypeId,
            salary: Number(Number(salaryValue).toFixed(2)),
            config_year_id: selectedConfigYear.id,
          };
          const saved = await dispatch<any>(saveSalaryByYear(payload));
          if (!saved) {
            throw new Error(`Error al guardar el salario para el tipo de empleado ${employeeTypeId}`);
          }
          return { columnKey, saved, salaryValue: Number(Number(salaryValue).toFixed(2)) };
        },
      );

      const results: { columnKey: string; saved: any; salaryValue: number | null }[] = await Promise.all(savePromises);

      const updatedRow = { ...originalRow } as any;
      results.forEach(({ columnKey, saved, salaryValue }) => {
        updatedRow[columnKey] = salaryValue;
        if (saved && saved.id) {
          updatedRow[`${columnKey}_id`] = saved.id;
        } else if (salaryValue === null) {
          delete updatedRow[`${columnKey}_id`];
        }
      });
      const newTable = (tableData || []).map((r: any) => (r.id === rowData.id ? updatedRow : r));
      dispatch(setTableData(newTable));
      setSuccessMessage("¡Los cambios se guardaron correctamente!");
      return true;
    } catch (error: any) {
      dispatch(setError(error.message));
      return false;
    }
  };

  const handleSave = (rowData: any): Promise<boolean> => {
    setOpenDialog(true);
    pendingRowRef.current = rowData;
    return new Promise<boolean>((resolve) => {
      pendingResolveRef.current = resolve;
    });
  };

  const handleConfirm = async () => {
    setOpenDialog(false);
    const row = pendingRowRef.current;
    pendingRowRef.current = null;
    const result = await performSave(row);
    if (pendingResolveRef.current) {
      pendingResolveRef.current(result);
      pendingResolveRef.current = null;
    }
  };

  const handleCancel = () => {
    setOpenDialog(false);
    pendingRowRef.current = null;
    if (pendingResolveRef.current) {
      pendingResolveRef.current(false);
      pendingResolveRef.current = null;
    }
  };

  const columns = [
    {
      id: "category_name",
      header: "CATEGORÍA",
      type: "text" as const,
      editable: false,
    },
    ...(employeeTypes?.responseObject || ([] as any[])).map((type: { id: string | number; display_name?: string }) => ({
      id: `type_${type.id}`,
      header: type.display_name || `Tipo ${type.id}`,
      type: "currency" as const,
      editable: true,
      renderCell: (row: any, isEditing: boolean, control: any) => {
        const columnKey = `type_${type.id}`;
        const salaryValue = row[columnKey];

        if (!isEditing) {
          return salaryValue !== null && salaryValue !== undefined
            ? new Intl.NumberFormat("es-MX", {
                style: "currency",
                currency: "MXN",
              }).format(Number(salaryValue))
            : "N/A";
        }

        return (
          <Controller
            name={columnKey}
            control={control}
            render={({
              field: { onChange, value, ref },
            }: { field: { onChange: (value: any) => void; value: any; ref: React.Ref<any> } }) => (
              <MyCurrencyMX
                customInput={Input}
                value={value ?? ""}
                onChange={onChange}
                getInputRef={ref}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                }}
              />
            )}
          />
        );
      },
    })),
  ];

  useEffect(() => {
    if (salariesFilterValues.year && Number(salariesFilterValues.year) !== selectedYear) {
      dispatch(setSelectedYear(Number(salariesFilterValues.year)));
    }
  }, [salariesFilterValues.year, selectedYear, dispatch]);

  return (
    <PageContainer title={title}>
      <Breadcrumb title={title} items={BCrumb} />
      <>
        <AppAlert
          severity="success"
          title="¡Éxito!"
          message={successMessage || ""}
          open={!!successMessage}
          onClose={() => setSuccessMessage(null)}
        />

        <AppAlert
          severity="error"
          title="Error"
          message={error || ""}
          open={!!error}
          onClose={() => dispatch(setError(null))}
        />
      </>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <ParentCard entity="salaries">
            <EnhancedTableToolbar key={selectedYear} filters={filtersConfig()} entity="salaries" />
            <Box sx={{ width: "100%", overflow: "auto" }} ref={tableContainerRef}>
              <EditableTable
                columns={columns}
                data={filteredData}
                onSave={handleSave}
                loading={loading}
                uniqueId="id"
                filtersConfig={filtersConfig}
                entity="salaries"
                emptyMessage={emptyMessage}
                showSearchBar={true}
                total={total}
              />
            </Box>
          </ParentCard>
        )}
      </Paper>

      <Dialog open={openDialog} maxWidth="sm" disableEscapeKeyDown>
        <DialogTitle id="alert-dialog-title" variant="h5">
          Confirmación
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">¿Desea guardar los cambios de salario?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={handleCancel} color="error">
            Cancelar
          </Button>
          <Button onClick={handleConfirm} color="primary" autoFocus>
            Continuar
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
}
