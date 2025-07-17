"use client";

import React, { useState } from "react";
import { Grid2 as Grid, Divider, Typography, Stack, Chip, Box, Paper } from "@mui/material";
import BlankCard from "@/components/shared/BlankCard";
import { StatusCodes } from "http-status-codes";
import { redirect } from "next/navigation";
import { getEmployeeIncidentById } from "@/services/employees-incidents";
import { formatDate } from "@/utils/formatter";
import { logger } from "@/lib/logger";
import CardContent from "@mui/material/CardContent";
import IncidentStatusHistory from "@/components/customComponents/IncidentStatusHistory";
import IncidentDetails from "@/components/customComponents/IncidentDetails";
import LoadingComponent from "@/components/customComponents/LoadingComponent";
import PDFGenerator from "@/components/shared/pdfs/PDFGenerator";
import IncidentTemplate from "@/components/shared/pdfs/templates/IncidentTemplate";
import IncidentDays from "@/components/customComponents/IncidentDays";

const IncidentDetailModal = ({ id }: any) => {
  const [loading, setLoading] = useState(false);
  const [employeeIncidentData, setEmployeeIncidentData] = useState<any>(null);
  const [directorName, setDirectorName] = useState<string>("");

  const fetchEmployeeIncidentById = (id: any) => {
    try {
      if (id) {
        setLoading(true);
        getEmployeeIncidentById(id as string).then((data) => {
          if (data.statusCode === StatusCodes.OK) {
            setEmployeeIncidentData(data.responseObject);

            getEmployeeIncidentById(id as string, true, data.responseObject.created_at)
              .then((pdfData) => {
                if (pdfData.success && pdfData.responseObject) {
                  const dataWithDirector = pdfData.responseObject;
                  const director = dataWithDirector?.direccion?.leaders?.[0];
                  const directorFullName = director?.employee
                    ? `${director.employee.name} ${director.employee.paternal_last_name} ${director.employee.maternal_last_name}`.toUpperCase()
                    : "";
                  setDirectorName(directorFullName);
                }
              })
              .catch((error) => {
                console.error("Error fetching director data for PDF:", error);
              });
          } else {
            setEmployeeIncidentData(null);
            redirect("/admin/employees-incidents");
          }
          setLoading(false);
        });
      }
    } catch (error: any) {
      logger.error({ error: error.message, stack: error.stack });
      setLoading(false);
      redirect("/admin/employees-incidents");
    }
  };

  React.useEffect(() => {
    fetchEmployeeIncidentById(id);
  }, [id]);

  if (!employeeIncidentData && !loading) return <LoadingComponent />;

  return (
    !loading && (
      <Grid container spacing={3}>
        <Grid size={12}>
          <Grid container>
            <Grid size={{ lg: 12, xs: 12 }}>
              <Stack direction={{ xs: "column", sm: "row" }} justifyContent="flex-end" sx={{ width: "100%" }}>
                <Box display="flex" gap={1}>
                  <PDFGenerator
                    data={{ ...employeeIncidentData, directorName }}
                    title="Formato de incidencia"
                    fileName={`incidencia-${employeeIncidentData.folio}`}
                    template={IncidentTemplate as any}
                  />
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Grid>

        <Grid size={12}>
          <BlankCard>
            <CardContent>
              <Stack direction={{ xs: "column", sm: "row" }} alignItems="center" justifyContent="space-between" mb={2}>
                <Box textAlign="left">
                  <Typography variant="h5">Folio: {employeeIncidentData.oficio || "PM/OM/DRH/1511/2025"}</Typography>
                  <Box mt={1}>
                    <Chip
                      size="medium"
                      color={employeeIncidentData.incident_status.btn_color}
                      label={employeeIncidentData.incident_status.display_name}
                    />
                  </Box>
                </Box>

                <Box
                  sx={{
                    textAlign: {
                      xs: "center",
                      sm: "left",
                    },
                  }}
                >
                  <Box mt={1}>
                    <Chip
                      size="medium"
                      color="secondary"
                      variant="outlined"
                      label={formatDate(employeeIncidentData.created_at, "dd/MM/yyyy HH:mm")}
                    ></Chip>
                  </Box>
                </Box>
              </Stack>
              <Divider></Divider>

              <Grid container spacing={3} mt={2} mb={4}>
                <Grid size={12}>
                  <IncidentDetails data={employeeIncidentData} />
                </Grid>
                {employeeIncidentData.incident.display_calendar_dates ? (
                  <Grid size={12}>
                    <IncidentDays data={employeeIncidentData} />
                  </Grid>
                ) : null}
              </Grid>

              <Grid mb={3} size={12}>
                <Paper variant="outlined" sx={{ height: "100%" }}>
                  <Box p={3} display="flex" flexDirection="column" gap="4px" height="100%">
                    <Grid container>
                      <Grid size={{ lg: 12, xs: 12 }} mb={2}>
                        <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
                          JUSTIFICACIÓN
                        </Typography>
                        <Divider></Divider>
                      </Grid>
                      <Grid size={{ lg: 9, xs: 12 }}>
                        <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
                          {employeeIncidentData.description}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              </Grid>

              <Grid mb={3} size={12}>
                <IncidentStatusHistory data={employeeIncidentData} />
              </Grid>
            </CardContent>
          </BlankCard>
        </Grid>
      </Grid>
    )
  );
};

export default IncidentDetailModal;
