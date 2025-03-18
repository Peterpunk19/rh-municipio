"use client";

import { Box, Typography } from "@mui/material";
import { AccessTime } from "@mui/icons-material";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const dotAnimation = keyframes`
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
`;

const AnimatedDot = styled.span`
  opacity: 0;
  animation: ${dotAnimation} 1.4s infinite;
  &:nth-of-type(2) { animation-delay: 0.2s; }
  &:nth-of-type(3) { animation-delay: 0.4s; }
`;

const IconWrapper = styled(Box)`
  margin-bottom: 16px;
  animation: spin 2s linear infinite;
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

interface LoadingScreenProps {
  fadeOut?: boolean;
}

export function LoadingScreen({ fadeOut }: LoadingScreenProps) {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        zIndex: 9999,
        animation: fadeOut ? `${fadeOut} 0.5s ease-out forwards` : "none",
      }}
    >
      <IconWrapper>
        <AccessTime sx={{ fontSize: 60, color: "primary.main" }} />
      </IconWrapper>
      <Typography variant="h4" color="primary" sx={{ fontWeight: 500 }}>
        Cargando sesión
        <AnimatedDot>.</AnimatedDot>
        <AnimatedDot>.</AnimatedDot>
        <AnimatedDot>.</AnimatedDot>
      </Typography>
    </Box>
  );
}
