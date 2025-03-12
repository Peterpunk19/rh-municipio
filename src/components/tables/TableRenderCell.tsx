import React from "react";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import { getNestedValue } from "@/common/utils";

interface RenderColumnProps {
  row: any;
  headCell: any;
  emptyText: any;
}

const TableRenderCell: React.FC<RenderColumnProps> = ({ row, headCell, emptyText }) => {
  let concatValue = headCell.concatValues
    ? headCell.concatValues.map((key: string) => getNestedValue(row, key) || "").join(" ")
    : "";

  const rawValue = getNestedValue(row, headCell.id);
  const value = rawValue ? `${rawValue} ${concatValue}`.trim() : concatValue.trim();

  return (
    <Box display="flex" flexDirection="column" alignItems="flex-start">
      <Typography align="left" variant="subtitle1" fontWeight={600}>
        {value ? value : emptyText || ""}
      </Typography>
      {headCell.children?.map((child: any, index: any) => (
        <Typography key={index} variant="subtitle2" color="textSecondary">
          {getNestedValue(row, child.id)}
        </Typography>
      ))}
    </Box>
  );
};

export default TableRenderCell;
