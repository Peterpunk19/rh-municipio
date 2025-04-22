import React from "react";
import { CircularProgress, Box } from "@mui/material";

const LoadingComponent = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="60vh"
      flexDirection="column"
    >
      <CircularProgress color="primary" />
    </Box>
  );
};

export default LoadingComponent;
