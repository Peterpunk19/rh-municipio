'use client'
import React from 'react';
import { Typography } from '@mui/material';
import {ILabelError} from "@/utils/types";

const CustomLabelError: React.FC<ILabelError> = ({ field = "" }) => {
  return field.length > 0 ? (
    <Typography
      variant="body1"
      sx={{ color: (theme) => theme.palette.error.main }}
    >
      {field}
    </Typography>
  ) : (
    <></>
  );
};
export default CustomLabelError;
