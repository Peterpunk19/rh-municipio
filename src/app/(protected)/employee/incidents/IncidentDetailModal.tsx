"use client";

import React, { useState } from "react";
import {
  Grid2 as Grid,
  Divider,
  Typography,
  Stack,
  Chip,
  Box,
  Paper,
  MenuItem,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Dialog,
  Alert,
} from "@mui/material";
import BlankCard from "@/components/shared/BlankCard";
import { StatusCodes } from "http-status-codes";
import { redirect } from "next/navigation";
import { getEmployeeIncidentById, updateEmployeeIncident } from "@/services/employees-incidents";
import { formatDate } from "@/utils/formatter";
import { logger } from "@/lib/logger";
import CardContent from "@mui/material/CardContent";
import IncidentStatusHistory from "@/components/customComponents/IncidentStatusHistory";
import IncidentDetails from "@/components/customComponents/IncidentDetails";
import LoadingComponent from "@/components/customComponents/LoadingComponent";
import PDFGenerator from "@/components/shared/pdfs/PDFGenerator";
import IncidentTemplate from "@/components/shared/pdfs/templates/IncidentTemplate";
import IncidentDays from "@/components/customComponents/IncidentDays";
import CustomSelect from "@/app/components/forms/theme-elements/CustomSelect";
import { generateUniqueKey } from "@/utils";
import { fetchCatalogData } from "@/services/catalogs";

const IncidentDetailModal = ({ id }: any) => {
  const [loading, setLoading] = useState(false);
  const [employeeIncidentData, setEmployeeIncidentData] = useState<any>(null);
  const [directorName, setDirectorName] = useState<string>("");
  const [idStatus, setIdStatus] = React.useState(0);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [data, setData] = useState<any>({
    id: id,
  });
  const [incidentStatus, setIncidentStatus] = useState<any>([]);

  const fetchEmployeeIncidentById = (id: any) => {
    try {
      if (id) {
        setLoading(true);
        getEmployeeIncidentById(id as string).then(async (data) => {
          if (data.statusCode === StatusCodes.OK) {
            setEmployeeIncidentData(data.responseObject);

            await fetchStatus(data.responseObject.incident_id);

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

  const fetchStatus = async (incidentId: number) => {
    try {
      const result = await fetchCatalogData(`incidents-status/permission-validation?incident_id=${incidentId}`);

      setIncidentStatus(result.responseObject);
    } catch (error) {
      console.error("Error fetching incident status:", error);
      setIncidentStatus([]);
    }
  };

  React.useEffect(() => {
    fetchEmployeeIncidentById(id);
  }, [id]);

  const handleChangeStatus = (e: { target: { value: any } }) => {
    setIdStatus(e.target.value);
    setData({ ...data, incidentStatusId: e.target.value });
    setOpenDialog(true);
  };

  const handleCancel = () => {
    setData({ ...data, incidentStatusId: 0 });
    setOpenDialog(false);
  };

  const handleConfirm = async () => {
    try {
      const response = await updateEmployeeIncident(data);

      if (!response.success && response?.responseObject) {
        setResponseMessage(response.message);
        setIsSuccess(false);
        return;
      }

      if (!response.success) {
        throw new Error("Failed to submit form. Please try again.");
      }

      setResponseMessage(response.message);
      fetchEmployeeIncidentById(id);
      setIsSuccess(true);
    } catch (err) {
      console.log(err);
    } finally {
      setIdStatus(0);
      setData({ ...data, incidentStatusId: 0 });
      setOpenDialog(false);
    }
  };

  if (!employeeIncidentData && !loading) return <LoadingComponent />;

  return (
    !loading && (
      <Grid container spacing={3}>
        <Grid size={12}>
          <Grid container>
            <Grid size={{ lg: 6, xs: 12 }}>
              {incidentStatus.length && employeeIncidentData.incident_status.name === "creada" ? (
                <Box>
                  <CustomSelect
                    value={data.incidentStatusId || 0}
                    onChange={handleChangeStatus}
                    sx={{
                      height: "40px",
                      "& .MuiSelect-select": {
                        paddingTop: "8px",
                        paddingBottom: "8px",
                      },
                    }}
                  >
                    <MenuItem key={generateUniqueKey()} value={0}>
                      Cambiar estatus de incidencia
                    </MenuItem>
                    {incidentStatus.map((item) => (
                      <MenuItem key={generateUniqueKey()} value={item.id}>
                        {item.display_name}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                </Box>
              ) : null}
            </Grid>

            <Grid size={{ lg: 6, xs: 12 }}>
              <Stack direction={{ xs: "column", sm: "row" }} justifyContent="flex-end" sx={{ width: "100%" }}>
                <Box display="flex" gap={1}>
                  <PDFGenerator
                    data={{ ...employeeIncidentData, directorName }}
                    title="Formato de incidencia"
                    fileName={`incidencia-${employeeIncidentData.folio}`}
                    template={IncidentTemplate as any}
                    optionsConfig={{
                      displayMode: "button",
                    }}
                  />
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Grid>

        <Grid size={12}>
          {responseMessage && (
            <Alert severity={isSuccess ? "success" : "error"}>
              <Typography variant="body1" fontWeight={600}>
                {responseMessage}
              </Typography>
            </Alert>
          )}
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
              <Dialog open={openDialog} maxWidth="md" disableEscapeKeyDown>
                <DialogTitle id="alert-dialog-title" variant="h5">
                  Cambio de estatus de la incidencia
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    ¿Está completamente seguro de cambiar el estatus de la incidencia?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button color="error" variant="contained" onClick={handleCancel} disabled={idStatus === 0}>
                    Cancelar
                  </Button>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={handleConfirm}
                    autoFocus
                    disabled={idStatus === 0}
                  >
                    Continuar
                  </Button>
                </DialogActions>
              </Dialog>
            </CardContent>
          </BlankCard>
        </Grid>
      </Grid>
    )
  );
};

export default IncidentDetailModal;
