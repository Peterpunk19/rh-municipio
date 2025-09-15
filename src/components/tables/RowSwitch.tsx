"use client";
import React, { useState } from "react";
import { Switch } from "@mui/material";
import { useDispatch } from "react-redux";
import { updateStatus } from "@/services/generic";
import { updateRequestsRolesPermissionsStatus } from "@/services/requests-roles-permissions";
import { AppDispatch } from "@/store/store";
import { useSelector } from "@/store/hooks";

interface RowSwitchProps {
  id: number;
  url: string;
  checked: boolean;
  entity: string;
  field: string;
  trueLabel?: string;
  falseLabel?: string;
  color?: "primary" | "secondary" | "default" | "success" | "error" | "info" | "warning";
  fetchAction?: (query: string) => any;
}

export const RowSwitch = ({
  id,
  url,
  checked: initialChecked,
  entity,
  field,
  fetchAction
}: RowSwitchProps) => {
  const [checked, setChecked] = useState(initialChecked);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { page, limit } = useSelector((state) => state.pagination);
  const { searchTerm, values } = useSelector(
    (state) => state.filters[entity] || { searchTerm: "", values: {} }
  );

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setLoading(true);

    try {
      if (entity === "requestsRolesPermissions") {
        await updateRequestsRolesPermissionsStatus(id, { [field]: newValue });
      } else {
        await updateStatus(url, id, { [field]: newValue });
      }
      setChecked(newValue);

      const queryParams = [];
      if (page) queryParams.push(`page=${page}`);
      if (limit) queryParams.push(`limit=${limit}`);
      if (searchTerm) queryParams.push(`search=${searchTerm}`);

      Object.keys(values).forEach((key) => {
        if (values[key]) queryParams.push(`${key}=${values[key]}`);
      });

      const queryString = queryParams.join("&");

      if (fetchAction) {
        dispatch(fetchAction(queryString));
      } else {
        const { fetchData } = await import(`@/store/${entity}/slice`);
        dispatch(fetchData(queryString));
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setChecked(!newValue);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Switch
      checked={checked}
      onChange={handleChange}
      disabled={loading}
      color="primary"
    />
  );
};