"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "@/store/hooks";
import { type RootState } from "@/store/store";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { IconSearch } from "@tabler/icons-react";
import { updateSearch } from "@/store/tables/FiltersSlice";
import { useDebouncedCallback } from "use-debounce";

type Props = {
  entity: string;
};

const CustomSearchTableField = ({ entity }: Props) => {
  const [search, setSearch] = React.useState("");
  const dispatch = useDispatch();

  const debounced = useDebouncedCallback((searchTerm: string) => {
    dispatch(updateSearch({ entity: entity, searchTerm: searchTerm }));
  }, 400);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = event.target.value;
    setSearch(searchQuery);
    debounced(searchQuery);
  };

  const { searchTerm } = useSelector((state: RootState) => state.filters[entity] || { values: {}, searchTerm: "" });

  useEffect(() => {
    if (searchTerm && setSearch) {
      setSearch(searchTerm);
    }
  }, []);

  return (
    <TextField
      placeholder="Buscar"
      size="small"
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
  );
};

export default CustomSearchTableField;
