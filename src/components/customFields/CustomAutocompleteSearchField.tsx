"use client";

import React, { useState, useEffect } from "react";
import { Autocomplete, TextField, CircularProgress, MenuItem, Paper } from "@mui/material";
import { useDebouncedCallback } from "use-debounce";
import { CustomAutocompleteProps } from "@/components/customFields/type";

const CustomAutocompleteSearchField: React.FC<CustomAutocompleteProps> = ({ field, handleChange }) => {
  const [inputValue, setInputValue] = useState(field.value);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<any[]>([]);

  const fetchOptions = useDebouncedCallback(async (query: string) => {
    if (!query) return;

    setLoading(true);
    try {
      const response = await fetch(`${field.url}?search=${query}`);
      const data = await response.json();
      setOptions(data.responseObject || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  }, 800);

  useEffect(() => {
    fetchOptions(inputValue);
  }, [inputValue, fetchOptions]);

  return (
    <Autocomplete
      freeSolo
      options={options}
      getOptionLabel={(option) => option.label}
      inputValue={inputValue}
      onInputChange={(_, option) => setInputValue(option)}
      onChange={(_, option) => handleChange(_, option)}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label={field.label}
          variant="outlined"
          fullWidth
          InputProps={{
            ...params.InputProps,
            endAdornment: loading ? <CircularProgress color="inherit" size={20} /> : null,
          }}
        />
      )}
      renderOption={(props, option) => (
        <MenuItem {...props} key={option.id}>
          {option.label}
        </MenuItem>
      )}
      PaperComponent={(props) => <Paper {...props} elevation={3} />}
    />
  );
};

export default CustomAutocompleteSearchField;
