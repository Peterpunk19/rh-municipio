import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { Toolbar, MenuItem } from "@mui/material";
import { alpha } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { IconSearch, IconTrash } from "@tabler/icons-react";
import CustomTextField from "../theme-elements/CustomTextField";
import Autocomplete from "@mui/material/Autocomplete";
import CustomSelect from "../theme-elements/CustomSelect";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { EnhancedTableToolbarProps } from "@/interfaces/EnhancedTableToolbarProps";
import type { FiltersConfig } from "@/interfaces/FiltersConfig";
import { updateFilter } from "@/store/tables/FiltersSlice";
import { useSelector, useDispatch } from "@/store/hooks";
import type { RootState } from "@/store/store";

import dayjs from "dayjs";
import "dayjs/locale/es";

const TableFilters = (props: EnhancedTableToolbarProps) => {
  const { numSelected, handleSearch, search, setSearch, filters = [], entity } = props;
  const { values, searchTerm } = useSelector(
    (state: RootState) => state.filters[entity] || { values: {}, searchTerm: "" },
  );
  const [localState, setLocalState] = useState<Record<string, any>>(() => ({}));
  const dispatch = useDispatch();

  useEffect(() => {
    if (searchTerm && setSearch) {
      setSearch(searchTerm);
    }
    if (values) {
      setLocalState(values);
    }
  }, []);

  const handleFilterChange = (filterKey: string, value: any) => {
    const isDateFilter = filters.some(
      (f) => (f.key === filterKey || filterKey.startsWith(f.key + "_")) && f.type === "date-range",
    );

    let formattedValue = value;

    if (isDateFilter) {
      formattedValue = value ? dayjs(value).format("YYYY-MM-DD") : null;
    }

    setLocalState((prev) => ({ ...prev, [filterKey]: formattedValue }));
    dispatch(
      updateFilter({
        entity,
        key: filterKey,
        value: formattedValue,
      }),
    );

    const filterConfig = filters.find((f) => f.key === filterKey);
    if (filterConfig?.onChange) {
      filterConfig.onChange(formattedValue);
    }
  };

  const renderFilter = (filter: FiltersConfig) => {
    switch (filter.type) {
      case "text":
        return (
          <TextField
            key={filter.key}
            placeholder={filter.label}
            size="small"
            value={localState[filter.key] || ""}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconSearch size="1.1rem" />
                </InputAdornment>
              ),
            }}
          />
        );

      case "select":
        return (
          <CustomSelect
            key={filter.key}
            value={localState[filter.key] || ""}
            label={filter.label}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange(filter.key, e.target.value)}
            fullWidth
          >
            <MenuItem value="">
              <em>- Seleccionar -</em>
            </MenuItem>
            {filter.options?.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </CustomSelect>
        );

      case "autocomplete":
        return (
          <Autocomplete
            key={filter.key}
            disablePortal
            options={filter.options || []}
            value={localState[filter.key] || null}
            onChange={(_, value) => handleFilterChange(filter.key, value)}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => (
              <CustomTextField {...params} placeholder={filter.label} aria-label={filter.label} />
            )}
          />
        );

      case "date":
        return (
          <LocalizationProvider key={filter.key} dateAdapter={AdapterDayjs} adapterLocale="es">
            <DatePicker
              value={localState[filter.key] || null}
              onChange={(newValue) => handleFilterChange(filter.key, newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  sx: {
                    "& .MuiSvgIcon-root": { width: "18px", height: "18px" },
                    "& .MuiFormHelperText-root": { display: "none" },
                  },
                },
              }}
            />
          </LocalizationProvider>
        );
      case "date-range":
        const startKey = `${filter.key}_start`;
        const endKey = `${filter.key}_end`;
        return (
          <LocalizationProvider key={filter.key} dateAdapter={AdapterDayjs} adapterLocale="es">
            <FormControl
              fullWidth
              sx={{
                marginTop: 1,
                "& .MuiFormLabel-root": {
                  transform: "translate(14px, 8px) scale(1)",
                },
              }}
            >
              <InputLabel
                shrink
                htmlFor={`${filter.key}-range`}
                sx={{
                  backgroundColor: "background.paper",
                  px: 1,
                  transform: "translate(14px, -9px) scale(0.75)",
                }}
              >
                {filter.label}
              </InputLabel>
              <Box
                id={`${filter.key}-range`}
                sx={{
                  display: "flex",
                  gap: 1,
                  flexDirection: { xs: "column", sm: "row" },
                  pt: 4,
                }}
              >
                <DatePicker
                  label="Inicio"
                  value={localState[startKey] ? dayjs(localState[startKey], "YYYY-MM-DD") : null}
                  format="DD-MM-YYYY"
                  onChange={(newValue) => handleFilterChange(startKey, newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: {
                        "& .MuiInputLabel-root": { display: "none" },
                        "& .MuiSvgIcon-root": { width: "18px", height: "18px" },
                      },
                    },
                  }}
                />
                <DatePicker
                  label="Fin"
                  value={localState[endKey] ? dayjs(localState[endKey], "YYYY-MM-DD") : null}
                  format="DD-MM-YYYY"
                  onChange={(newValue) => handleFilterChange(endKey, newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: {
                        "& .MuiInputLabel-root": { display: "none" },
                        "& .MuiSvgIcon-root": { width: "18px", height: "18px" },
                      },
                    },
                  }}
                />
              </Box>
            </FormControl>
          </LocalizationProvider>
        );

      default:
        return null;
    }
  };

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography>{numSelected} selected</Typography>
      ) : (
        <Box
          sx={{
            flex: "1 1 100%",
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "flex-start",
          }}
        >
          {handleSearch && (
            <Box
              sx={{
                minWidth: 150,
                flex: "1 1 auto",
              }}
            >
              <TextField
                placeholder="Buscar"
                size="medium"
                value={search || ""}
                onChange={handleSearch}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconSearch size="1.1rem" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          )}

          {filters.map((filter) =>
            filter.type === "date-range" ? (
              <Box
                key={filter.key}
                sx={{
                  width: 500,
                  flex: "0 0 auto",
                  minWidth: 400,
                }}
              >
                {renderFilter(filter)}
              </Box>
            ) : (
              <Box
                key={filter.key}
                sx={{
                  width: 250,
                  flex: "0 0 auto",
                  minWidth: 200,
                }}
              >
                {renderFilter(filter)}
              </Box>
            ),
          )}
        </Box>
      )}

      {numSelected > 0 && (
        <Tooltip title="Delete">
          <IconButton>
            <IconTrash width="18" />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

export default TableFilters;
