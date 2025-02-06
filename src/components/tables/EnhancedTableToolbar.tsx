import { useState } from "react";
import Box from "@mui/material/Box";
import { Toolbar, MenuItem } from "@mui/material";
import { alpha } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { IconFilter, IconSearch, IconTrash } from "@tabler/icons-react";
import CustomTextField from "../theme-elements/CustomTextField";
import Autocomplete from "@mui/material/Autocomplete";
import CustomSelect from "../theme-elements/CustomSelect";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { EnhancedTableToolbarProps } from "@/interfaces/EnhancedTableToolbarProps";
import { FiltersConfig } from "@/interfaces/FiltersConfig";
import { updateFilter } from "@/store/tables/FiltersSlice";

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const { numSelected, handleSearch, search, filters = [] } = props;
  const dispatch = useDispatch<AppDispatch>();

  const [localState, setLocalState] = useState<Record<string, any>>({});

  const handleFilterChange = (filterKey: string, value: any) => {
    setLocalState((prev) => ({ ...prev, [filterKey]: value }));
    dispatch(updateFilter({ key: filterKey, value }));

    const filterConfig = filters.find((f) => f.key === filterKey);
    if (filterConfig?.onChange) {
      filterConfig.onChange(value);
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange(filter.key, e.target.value)}
            fullWidth
            variant="outlined"
          >
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
              <CustomTextField
                {...params}
                placeholder={filter.label}
                aria-label={filter.label}
              />
            )}
          />
        );

      case "date":
        return (
          <LocalizationProvider key={filter.key} dateAdapter={AdapterDayjs}>
            <DateTimePicker
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
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography>{numSelected} selected</Typography>
      ) : (
        <Box sx={{ flex: "1 1 100%", display: "none", gap: 2 }}>
          {handleSearch && (
            <TextField
              placeholder="Buscar"
              size="small"
              value={search}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconSearch size="1.1rem" />
                  </InputAdornment>
                ),
              }}
            />
          )}

          {filters.map((filter) => (
            <Box key={filter.key} sx={{ width: 250 }}>
              {renderFilter(filter)}
            </Box>
          ))}
        </Box>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <IconTrash width="18" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list" sx={{display: "none"}} >
          <IconButton>
            <IconFilter size="1.2rem" />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

export default EnhancedTableToolbar;
