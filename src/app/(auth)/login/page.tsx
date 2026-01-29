"use client";

import { Grid2 as Grid, Box, Card, Stack, Alert } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import Logo from "@/app/(DashboardLayout)/layout/shared/logo/Logo";
import PageContainer from "@/app/components/container/PageContainer";
import AuthLogin from "../../components/auth/AuthLogin";

function LoginContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  const getSuccessMessage = () => {
    switch (message) {
      case "password_changed":
        return "Contraseña cambiada exitosamente. Por favor, inicia sesión con tu nueva contraseña.";
      default:
        return null;
    }
  };

  const successMessage = getSuccessMessage();

  return (
    <Card
      elevation={9}
      sx={{ p: 4, zIndex: 1, width: "100%", maxWidth: "450px" }}
    >
      <Box display="flex" alignItems="center" justifyContent="center">
        <Logo />
      </Box>
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2, mt: 2 }}>
          {successMessage}
        </Alert>
      )}
      <AuthLogin
        subtitle={
          <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            mt={3}
          >
          </Stack>
        }
      />
    </Card>
  );
}

export default function Login() {
  return (
    (<PageContainer title="Iniciar sesión" description="this is Sample page">
      <Box
        sx={{
          position: "relative",
          "&:before": {
            content: '""',
            background: "#ecf2ff",
            backgroundSize: "400% 400%",
            animation: "gradient 15s ease infinite",
            position: "absolute",
            height: "100%",
            width: "100%",
          },
        }}
      >
        <Grid
          container
          spacing={0}
          justifyContent="center"
          sx={{ height: "100vh" }}
        >
          <Grid
            display="flex"
            justifyContent="center"
            alignItems="center"
            size={{
              xs: 12,
              sm: 12,
              lg: 5,
              xl: 4
            }}>
            <Suspense fallback={
              <Card elevation={9} sx={{ p: 4, zIndex: 1, width: "100%", maxWidth: "450px" }}>
                <Box display="flex" alignItems="center" justifyContent="center">
                  <Logo />
                </Box>
              </Card>
            }>
              <LoginContent />
            </Suspense>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>)
  );
}
