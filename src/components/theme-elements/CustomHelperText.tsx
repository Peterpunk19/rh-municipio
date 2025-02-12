'use client'
import React from 'react';
import {Typography} from '@mui/material';
import {IHelperText} from "@/utils/types";

const CustomHelperText: React.FC<IHelperText> = ({ field = "" }) => {
  return field.length > 0 ? (
      <Typography variant="h6" fontWeight="400" sx={{ mt: 1 }}>
        {field}
      </Typography>
  ) : (
    <></>
  );
};
export default CustomHelperText;
