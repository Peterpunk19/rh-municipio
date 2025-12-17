"use client";

import React from "react";
import {
  Box,
  Typography,
  Button,
  ButtonGroup,
} from "@mui/material";

interface CalendarHeaderProps {
  title: string;
  onPrevious: () => void;
  onNext: () => void;
  rightSlot?: React.ReactNode;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
                                                         title,
                                                         onPrevious,
                                                         onNext,
                                                         rightSlot,
                                                       }) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={2}
      sx={{
        bgcolor: "#FFF",
        borderRadius: 2,
        p: 1.5,
        boxShadow: "0 1px 3px rgba(15, 23, 42, 0.08)",
      }}
    >
      <ButtonGroup variant="outlined" size="small">
        <Button onClick={onPrevious}>Anterior</Button>
        <Button onClick={onNext}>Siguiente</Button>
      </ButtonGroup>

      <Typography variant="h3" fontWeight={400} color="textSecondary">
        {title}
      </Typography>

      <Box display="flex" alignItems="center" gap={2}>
        {rightSlot}
      </Box>
    </Box>
  );
};

export default CalendarHeader;
