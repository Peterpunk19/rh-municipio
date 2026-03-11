"use client";

import React, { useState } from "react";
import {
  Grid2 as Grid,
  Divider,
  Typography,
  Button,
  Stack,
  Chip,
  Alert,
  Grid2,
  Box,
  MenuItem,
  Paper,
} from "@mui/material";
import BlankCard from "@/components/shared/BlankCard";
import { StatusCodes } from "http-status-codes";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import { useParams, redirect } from "next/navigation";
import { getEmployeeIncidentById, updateEmployeeIncident } from "@/services/employees-incidents";
import { fetchCatalogData } from "@/services/catalogs";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { formatDate } from "@/utils/formatter";
import { logger } from "@/lib/logger";
import CardContent from "@mui/material/CardContent";
import { generateUniqueKey } from "@/utils";
import CustomSelect from "@/app/components/forms/theme-elements/CustomSelect";
import EmployeeDetails from "@/components/customComponents/EmployeeDetails";
import IncidentStatusHistory from "@/components/customComponents/IncidentStatusHistory";
import IncidentDetails from "@/components/customComponents/IncidentDetails";
import LoadingComponent from "@/components/customComponents/LoadingComponent";
import PDFGenerator from "@/components/shared/pdfs/PDFGenerator";
import IncidentTemplate from "@/components/shared/pdfs/templates/IncidentTemplate";
import ArrestoIncident from "@/components/shared/pdfs/templates/incidents/ArrestoIncident";
import { IncidentTypes } from "@/common/constants/IncidentTypes";
import IncidentDays from "@/components/customComponents/IncidentDays";
import Link from "next/link";
import { IconArrowBack } from "@tabler/icons-react";
import { ROLES, ROLES_ID_VALUES } from "@/common/constants/Roles";

const BCrumb = [
  {
    to: "/admin/employees-incidents",
    title: "Incidencias de empleados",
  },
  {
    title: "Detalles de incidencia",
  },
];

const EmployeeIncident = () => {
  const [loading, setLoading] = useState(false);
  const [employeeIncidentData, setEmployeeIncidentData] = useState<any>(null);
  const [signatoryData, setSignatoryData] = useState<any>(null);
  const [immediateResponsibleData, setImmediateResponsibleData] = useState<any>(null);
  const { id } = useParams();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [idStatus, setIdStatus] = React.useState(0);
  const [responseMessage, setResponseMessage] = useState("");
  const [errorResponse, setErrorResponse] = useState("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [data, setData] = useState<any>({});
  const [incidentStatus, setIncidentStatus] = useState<any>([]);

  const fetchEmployeeIncidentById = (id: any) => {
    try {
      if (id) {
        setLoading(true);
        getEmployeeIncidentById(id as string).then(async (data) => {
          if (data.statusCode === StatusCodes.OK) {
            setEmployeeIncidentData(data.responseObject);
            setData({
              id: data.responseObject.id,
            });

            await fetchStatus(data.responseObject.incident_id);

            getEmployeeIncidentById(id as string, true, data.responseObject.created_at)
              .then((pdfData) => {
                if (pdfData.success && pdfData.responseObject) {
                  const dataWithDirector = pdfData.responseObject;
                  const leaders = dataWithDirector?.direccion?.leaders;
                  const signatory = leaders.find((l: any) => l.sign_incidents);
                  const immediateResponsible = leaders.find(
                    (l: any) => l.role_id === ROLES_ID_VALUES[ROLES.RESPONSABLE_INMEDIATO],
                  );
                  const signatoryFullName = signatory?.employee
                    ? `${signatory.employee.name} ${signatory.employee.paternal_last_name} ${signatory.employee.maternal_last_name}`.toUpperCase()
                    : "";
                  const immediateResponsibleFullName = immediateResponsible?.employee
                    ? `${immediateResponsible.employee.name} ${immediateResponsible.employee.paternal_last_name} ${immediateResponsible.employee.maternal_last_name}`.toUpperCase()
                    : "";
                  setSignatoryData({
                    name: signatoryFullName,
                    role: signatory?.role?.display_name,
                  });
                  setImmediateResponsibleData({
                    name: immediateResponsibleFullName,
                    role: immediateResponsible?.role?.display_name,
                  });
                }
              })
              .catch((error) => {
                console.error("Error fetching director data for PDF:", error);
              });
          } else {
            setEmployeeIncidentData(null);
            setErrorResponse(data.message);
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
      logger.error("Error fetching incident status:", error);
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
      if (!response.success) {
        if (response && response.responseObject) {
          setResponseMessage(response.message);
          setIsSuccess(false);
        } else {
          throw new Error("Failed to submit form. Please try again.");
        }
        return;
      } else {
        setResponseMessage(response.message);
        fetchEmployeeIncidentById(id);
        setIsSuccess(true);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setData({ ...data, incidentStatusId: 0 });
      setIdStatus(0);
      setOpenDialog(false);
    }
  };

  if (errorResponse) {
    return (
      <Grid2 size={12}>
        <Alert severity={isSuccess ? "success" : "error"}>
          <Typography variant="body1" fontWeight={600}>
            {errorResponse}
          </Typography>
        </Alert>
        <Button
          size="small"
          variant="contained"
          color="error"
          component={Link}
          href="/admin/employees-incidents"
          sx={{
            mt: 2,
          }}
          startIcon={<IconArrowBack stroke={1.5} size="0.8rem" />}
        >
          Regresar
        </Button>
      </Grid2>
    );
  }

  if (!employeeIncidentData && !loading) return <LoadingComponent />;

  return (
    !loading &&
    employeeIncidentData && (
      <Grid container spacing={3}>
        <Breadcrumb title="Detalles de incidencia" items={BCrumb} />
        <Grid size={12}>
          <Grid container>
            <Grid size={{ lg: 6, xs: 12 }}>
              {incidentStatus.length ? (
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
                    {incidentStatus.map((item: any) => (
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
                    data={{
                      ...employeeIncidentData,
                      signatory: signatoryData,
                      immediateResponsible: immediateResponsibleData,
                    }}
                    title="Formato de incidencia"
                    fileName={`incidencia-${employeeIncidentData.folio}`}
                    template={
                      employeeIncidentData.incident?.name === IncidentTypes.ARRESTO
                        ? (ArrestoIncident as any)
                        : (IncidentTemplate as any)
                    }
                    optionsConfig={{
                      displayMode: "button",
                    }}
                  />
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Grid>

        <Grid2 size={12}>
          {responseMessage && (
            <Alert severity={isSuccess ? "success" : "error"}>
              <Typography variant="body1" fontWeight={600}>
                {responseMessage}
              </Typography>
            </Alert>
          )}
        </Grid2>

        <Grid size={12}>
          <BlankCard>
            <CardContent>
              <Stack direction={{ xs: "column", sm: "row" }} alignItems="center" justifyContent="space-between" mb={2}>
                <Box
                  sx={{
                    textAlign: {
                      xs: "center",
                      sm: "left",
                    },
                  }}
                >
                  <Typography variant="h5">Oficio: {employeeIncidentData.folio}</Typography>
                  <Box mt={1}>
                    <Chip
                      size="medium"
                      color="secondary"
                      variant="outlined"
                      label={formatDate(employeeIncidentData.created_at, "dd/MM/yyyy HH:mm")}
                    ></Chip>
                  </Box>
                </Box>

                <Box textAlign="right">
                  <Typography variant="h5">Folio: {employeeIncidentData.folio}</Typography>
                  <Box mt={1}>
                    <Chip
                      size="medium"
                      color={employeeIncidentData.incident_status.btn_color}
                      label={`${employeeIncidentData.incident_status.display_name} - ${formatDate(employeeIncidentData.created_at, "dd/MM/yyyy HH:mm")}`}
                    />
                  </Box>
                </Box>
              </Stack>
              <Divider></Divider>

              <Grid container spacing={3} mt={2} mb={4}>
                <Grid size={6}>
                  <EmployeeDetails data={employeeIncidentData} />
                </Grid>
                <Grid size={6}>
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
            <Button color="primary" variant="contained" onClick={handleConfirm} autoFocus disabled={idStatus === 0}>
              Continuar
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    )
  );
};

export default EmployeeIncident;
