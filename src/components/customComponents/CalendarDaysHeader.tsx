"use client";

import React from "react";
import { Box, Typography } from "@mui/material";

interface Props {
  days: string[];
  mb?: number;
}

const CalendarDaysHeader: React.FC<Props> = ({ days, mb = 1 }) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        mb,
      }}
    >
      {days.map((d) => (
        <Typography
          key={d}
          align="center"
          variant="caption"
          fontWeight={700}
          sx={{ color: "#64748B" }}
        >
          {d.toUpperCase()}
        </Typography>
      ))}
    </Box>
  );
};

export default CalendarDaysHeader;
