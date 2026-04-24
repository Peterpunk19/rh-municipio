"use client";

import * as React from "react";
import { formatDate } from "@/utils/formatter";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Grid2 as Grid, Divider, Chip, Paper, Stack } from "@mui/material";

type HiringTabProps = EmployeePageProps & {
  onTerminateContract?: (hiring: any) => void;
  onCreateNewContract?: (employeeData: any) => void;
  canManageContracts?: boolean;
};

const HiringTab = ({
  employeeData,
  onTerminateContract,
  onCreateNewContract,
  canManageContracts = true,
}: HiringTabProps) => {
  const hirings = employeeData?.employee_hiring ?? [];
  const tradeUnionDisplayName = employeeData?.employee_trade_union?.[0]?.trade_union?.display_name;
  const statusEmployeeDisplayName = employeeData?.status_employee?.display_name;

  const activeHiring = hirings.find((hiring: any) => !hiring.end_job_date);
  const hasActiveHiring = !!activeHiring;

  if (!hirings.length) {
    return (
      <Box p={3}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={2}
          mb={2}
        >
          <Typography variant="subtitle1" fontWeight={600}>
            No hay historial de contratación registrado
          </Typography>

          {canManageContracts && (
            <Button variant="contained" onClick={() => onCreateNewContract?.(employeeData)}>
              Nuevo contrato
            </Button>
          )}
        </Stack>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", md: "flex-start" }}
        spacing={2}
        mb={3}
      >
        <Box flex={1}>
          <Grid container spacing={2}>
            <Grid size={{ lg: 4, xs: 12 }}>
              <Typography variant="body2" color="text.secondary">
                Estatus de empleado
              </Typography>
              <Typography variant="subtitle1" fontWeight={600}>
                {statusEmployeeDisplayName || "No disponible"}
              </Typography>
            </Grid>

            <Grid size={{ lg: 4, xs: 12 }}>
              <Typography variant="body2" color="text.secondary">
                Sindicato
              </Typography>
              <Typography variant="subtitle1" fontWeight={600}>
                {tradeUnionDisplayName || "No asignado"}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {canManageContracts && (
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <Button variant="contained" disabled={hasActiveHiring} onClick={() => onCreateNewContract?.(employeeData)}>
              Nuevo contrato
            </Button>
          </Stack>
        )}
      </Stack>

      <Divider sx={{ mb: 3 }} />

      <Box display="flex" flexDirection="column" gap={3}>
        {hirings.map((hiring: any, index: number) => {
          const isCurrent = !hiring.end_job_date;

          return (
            <Paper key={hiring.id} variant="outlined" sx={{ p: 3 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", md: "center" }}
                flexDirection={{ xs: "column", md: "row" }}
                gap={2}
                mb={2}
              >
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    Contrato {hirings.length - index}
                  </Typography>
                </Box>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems="center">
                  <Chip
                    label={isCurrent ? "Activo" : "Finalizado"}
                    color={isCurrent ? "success" : "default"}
                    size="small"
                  />

                  {canManageContracts && isCurrent && (
                    <Button variant="outlined" color="error" onClick={() => onTerminateContract?.(hiring)}>
                      Terminar contrato
                    </Button>
                  )}
                </Stack>
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ lg: 3, xs: 12 }}>
                  <Typography variant="body2" color="text.secondary">
                    Categoría
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {hiring.category?.display_name || "No disponible"}
                  </Typography>
                </Grid>

                <Grid size={{ lg: 3, xs: 12 }}>
                  <Typography variant="body2" color="text.secondary">
                    Tipo de empleado
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {hiring.employee_type?.display_name || "No disponible"}
                  </Typography>
                </Grid>

                <Grid size={{ lg: 3, xs: 12 }}>
                  <Typography variant="body2" color="text.secondary">
                    Fecha de alta
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {formatDate(hiring.start_job_date)}
                  </Typography>
                </Grid>

                <Grid size={{ lg: 3, xs: 12 }}>
                  <Typography variant="body2" color="text.secondary">
                    Fecha de baja
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {formatDate(hiring.end_job_date) || "Vigente"}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" fontWeight={700} mb={2}>
                Ascripciones
              </Typography>

              {hiring.employee_ascriptions?.length ? (
                <Grid container spacing={2}>
                  {hiring.employee_ascriptions.map((ascription: any) => (
                    <Grid key={ascription.id} size={{ xs: 12 }}>
                      <Paper variant="outlined" sx={{ p: 2, backgroundColor: "grey.50" }}>
                        <Grid container spacing={2}>
                          <Grid size={{ lg: 4, xs: 12 }}>
                            <Typography variant="body2" color="text.secondary">
                              Dirección
                            </Typography>
                            <Typography variant="subtitle1" fontWeight={600}>
                              {ascription.direccion?.display_name || "No disponible"}
                            </Typography>
                          </Grid>

                          <Grid size={{ lg: 4, xs: 12 }}>
                            <Typography variant="body2" color="text.secondary">
                              Secretaría
                            </Typography>
                            <Typography variant="subtitle1" fontWeight={600}>
                              {ascription.direccion?.secretaria?.display_name || "No disponible"}
                            </Typography>
                          </Grid>

                          <Grid size={{ lg: 2, xs: 12 }}>
                            <Typography variant="body2" color="text.secondary">
                              Inicio
                            </Typography>
                            <Typography variant="subtitle1" fontWeight={600}>
                              {formatDate(ascription.start_date)}
                            </Typography>
                          </Grid>

                          <Grid size={{ lg: 2, xs: 12 }}>
                            <Typography variant="body2" color="text.secondary">
                              Fin
                            </Typography>
                            <Box mt={0.5}>
                              {formatDate(ascription.end_date) ? (
                                <Typography variant="subtitle1" fontWeight={600}>
                                  {formatDate(ascription.end_date)}
                                </Typography>
                              ) : (
                                <Chip label="Vigente" color="primary" size="small" />
                              )}
                            </Box>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="subtitle1" color="text.secondary">
                  No hay ascripciones registradas en este contrato
                </Typography>
              )}
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
};

export default HiringTab;
