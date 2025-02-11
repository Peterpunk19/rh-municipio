"use client";
import { FormControl, InputLabel, Select } from "@mui/material";

export default function CustomSelect(props: any & { label: string }) {
  return (
    <FormControl fullWidth={props.fullWidth}>
      <InputLabel id={`${props.label}-label`}>{props.label}</InputLabel>
      <Select {...props} labelId={`${props.label}-label`} label={props.label} />
    </FormControl>
  );
}
