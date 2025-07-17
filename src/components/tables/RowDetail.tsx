"use client";
import { IconButton, Tooltip } from "@mui/material";
import { IconFile } from "@tabler/icons-react";
import React from "react";

interface RowDetailProps {
  onClick: () => void;
}

export const RowDetail = ({ onClick }: RowDetailProps) => {
  return (
    <Tooltip title="Ver detalle" placement="left">
      <IconButton onClick={onClick}>
        <IconFile />
      </IconButton>
    </Tooltip>
  );
};