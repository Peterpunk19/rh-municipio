import { Grid2 as Grid, Box, Card, Typography } from "@mui/material";

import Logo from "@/app/(DashboardLayout)/layout/shared/logo/Logo";
import PageContainer from "@/app/components/container/PageContainer";
import AuthChangePassword from "../../components/auth/AuthChangePassword";

export default function ChangePasswordPage() {
  return (
    <PageContainer title="Cambiar Contraseña" description="Cambio de contraseña obligatorio">
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
            <Card
              elevation={9}
              sx={{ p: 4, zIndex: 1, width: "100%", maxWidth: "500px" }}
            >
              <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                <Logo />
              </Box>
              <Typography variant="h5" textAlign="center" fontWeight={600} mb={1}>
                Cambiar Contraseña
              </Typography>
              <Typography variant="body2" textAlign="center" color="text.secondary" mb={3}>
                Por seguridad, debes cambiar tu contraseña temporal antes de continuar.
              </Typography>
              <AuthChangePassword />
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
}
