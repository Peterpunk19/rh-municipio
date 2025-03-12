import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import type { EnhancedTableProps } from "@/interfaces/EnhancedTableProps";
import Typography from "@mui/material/Typography";
import React from "react";

function TableHeaders(props: EnhancedTableProps) {
  const { headCells } = props;

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
          >
            <Typography align="center" variant="subtitle1" fontWeight={600}>
              {headCell.label}
            </Typography>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default TableHeaders;
