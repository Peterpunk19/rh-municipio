"use client";
import { styled, Container, Box } from "@mui/material";

const MainWrapper = styled("div")(() => ({
  display: "flex",
  minHeight: "100vh",
  width: "100%",
}));

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainWrapper>
      <Container
        sx={{
          paddingTop: "20px",
          maxWidth: "1200px",
        }}
      >
        <Box sx={{ minHeight: "calc(100vh - 170px)" }}>{children}</Box>
      </Container>
    </MainWrapper>
  );
}
