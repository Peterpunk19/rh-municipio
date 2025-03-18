"use client";

import React, { useState, useCallback } from "react";
import {
  Grid2,
  Box,
  Divider,
  Typography,
  Button,
  Stack,
  Chip,
  FormControl,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import BlankCard from "@/components/shared/BlankCard";
import { StatusCodes } from "http-status-codes";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import { useParams, redirect } from "next/navigation";
import { getEmployeeIncidentById } from "@/services/employees-incidents";
import CustomFormLabel from "@/components/theme-elements/CustomFormLabel";
import CustomTextField from "@/components/theme-elements/CustomTextField";
import { fetchCatalogData } from "@/services/catalogs";
import { useFetchOptions } from "@/components/customHooks/useFetchOptions";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { formatDate } from "@/utils/formatter";
import { logger } from "@/lib/logger";

const BCrumb = [
  {
    to: "/admin/employees-incidents",
    title: "Incidencias de empleados",
  },
  {
    title: "Detalles de incidencia",
  },
];

const iconMap = {
  clock: <AccessTimeOutlinedIcon width={18} />,
  check: <CheckBoxOutlinedIcon width={18} />,
  x: <ClearOutlinedIcon width={18} />,
  trash: <DeleteOutlineOutlinedIcon width={18} />,
};

const EmployeeIncident = () => {
  const [loading, setLoading] = useState(false);
  const [employeeIncidentData, setEmployeeIncidentData] = useState<any>(null);
  const { id } = useParams();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [idStatus, setIdStatus] = React.useState(0);

  React.useEffect(() => {
    try {
      if (id) {
        setLoading(true);
        getEmployeeIncidentById(id as string).then((data) => {
          if (data.statusCode === StatusCodes.OK) {
            setEmployeeIncidentData(data.responseObject);
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
  }, [id]);

  const catalogName = "incidents-status";
  const fetchData = useCallback(() => fetchCatalogData(catalogName), [catalogName]);

  const { options: incidentStatus, isLoading, error } = useFetchOptions(fetchData);

  const handleChangeStatus = (id: any) => {
    setOpenDialog(true);
    setIdStatus(id);
  };

  const handleCancel = () => {
    setOpenDialog(false);
  };

  const handleConfirm = async () => {
    try {
    } catch (err) {
      console.log(err);
    } finally {
      setIdStatus(0);
      setOpenDialog(false);
    }
  };

  if (!employeeIncidentData && !loading) return <div>Incidencia no encontrada</div>;
  if (loading) return <div>Cargando...</div>;

  return (
    !loading && (
      <Grid2 container spacing={3}>
        <Breadcrumb title="Detalles de incidencia" items={BCrumb} />
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="flex-end" sx={{ width: "100%" }}>
          <Button variant="contained" color="info" sx={{ display: "flex" }}>
            Descargar formato
          </Button>
        </Stack>
        <BlankCard>
          <Grid2 container spacing={2} p={3} justifyContent="center" alignItems="center">
            <Grid2 size={{ md: 4 }} display="flex" flexDirection="column" alignItems="center" textAlign="center">
              <Typography variant="subtitle1" gutterBottom>
                Tipo de Incidencia
              </Typography>
              <Typography variant="h5">{employeeIncidentData.incident.display_name}</Typography>
            </Grid2>

            <Grid2 size={{ md: 4 }} display="flex" flexDirection="column" alignItems="center" textAlign="center">
              <Typography variant="subtitle1" gutterBottom>
                Estatus de Incidencia
              </Typography>
              <Chip
                color={employeeIncidentData.incident_status.btn_color}
                label={employeeIncidentData.incident_status.btn_display_name}
                size="medium"
                sx={{ fontSize: "16px" }}
              />
            </Grid2>

            <Grid2 size={{ md: 4 }} display="flex" flexDirection="column" alignItems="center" textAlign="center">
              <Typography variant="subtitle1" gutterBottom>
                Fecha de Solicitud
              </Typography>
              <Typography variant="h5">{formatDate(employeeIncidentData.created_at, "dd/MM/yyyy HH:mm")}</Typography>
            </Grid2>
          </Grid2>
          <Divider></Divider>

          <Grid2 container spacing={2} p={3}>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <CustomFormLabel>Empleado</CustomFormLabel>
                <CustomTextField
                  value={`${employeeIncidentData.employee.name} ${employeeIncidentData.employee.paternal_last_name} ${employeeIncidentData.employee.maternal_last_name}`}
                  variant="outlined"
                  fullWidth
                  readOnly
                />
              </FormControl>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <CustomFormLabel>Folio</CustomFormLabel>
                <CustomTextField value={employeeIncidentData.folio} variant="outlined" fullWidth readOnly />
              </FormControl>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <CustomFormLabel>Oficio</CustomFormLabel>
                <CustomTextField value={employeeIncidentData.oficio} variant="outlined" fullWidth readOnly />
              </FormControl>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <CustomFormLabel>Organismo público</CustomFormLabel>
                <CustomTextField
                  value={employeeIncidentData.employee.employee_hiring?.[0]?.direccion?.secretaria?.display_name}
                  variant="outlined"
                  fullWidth
                  readOnly
                />
              </FormControl>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <CustomFormLabel>Organismo administrativo</CustomFormLabel>
                <CustomTextField
                  value={employeeIncidentData.employee.employee_hiring?.[0]?.direccion?.display_name}
                  variant="outlined"
                  fullWidth
                  readOnly
                />
              </FormControl>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <CustomFormLabel>Categoría</CustomFormLabel>
                <CustomTextField
                  value={employeeIncidentData.employee.employee_hiring?.[0]?.category?.display_name}
                  variant="outlined"
                  fullWidth
                  readOnly
                />
              </FormControl>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <CustomFormLabel>Fecha de inicio</CustomFormLabel>
                <CustomTextField
                  value={formatDate(employeeIncidentData.start_date)}
                  variant="outlined"
                  fullWidth
                  readOnly
                />
              </FormControl>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <CustomFormLabel>Fecha de terminación</CustomFormLabel>
                <CustomTextField
                  value={formatDate(employeeIncidentData.end_date)}
                  variant="outlined"
                  fullWidth
                  readOnly
                />
              </FormControl>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <CustomFormLabel>Solicitada por</CustomFormLabel>
                <CustomTextField value="" variant="outlined" fullWidth readOnly />
              </FormControl>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <CustomFormLabel>Aprobada por</CustomFormLabel>
                <CustomTextField value="" variant="outlined" fullWidth readOnly />
              </FormControl>
            </Grid2>
            <Grid2 size={{ lg: 12 }}>
              <FormControl fullWidth>
                <CustomFormLabel>Justificación</CustomFormLabel>
                <CustomTextField value={employeeIncidentData.description} multiline fullWidth readOnly />
              </FormControl>
            </Grid2>
          </Grid2>

          <Grid2 size={12} p={3}>
            <Stack direction="row" spacing={2} justifyContent="center" mt={4}>
              {!isLoading &&
                !error &&
                incidentStatus?.map((status) => (
                  <Button
                    key={status.id}
                    type="button"
                    variant="contained"
                    color={status.btn_color}
                    sx={{ display: "flex" }}
                    startIcon={iconMap[status.btn_icon]}
                    onClick={() => handleChangeStatus(status.id)}
                  >
                    {status.btn_display_name}
                  </Button>
                ))}
            </Stack>
          </Grid2>

          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="flex-start" p={3}>
            <Typography variant="h3">Historial de estatus</Typography>
          </Stack>
          <Divider></Divider>
          <Grid2 container spacing={2} p={3}>
            <Typography variant="body1"></Typography>
            <List>
              <ListItem key="1">
                <ListItemText
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      Usuario: Juan cambió el estatus de la incidencia a APROBADA fecha: 12/02/2025 13:00
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </Grid2>
        </BlankCard>

        <Dialog open={openDialog} maxWidth="md" disableEscapeKeyDown>
          <DialogTitle id="alert-dialog-title" variant="h5">
            {"Cambio de estatus de la incidencia"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              ¿Está completamente seguro de cambiar el estatus de la incidencia?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={handleConfirm} autoFocus disabled={idStatus === 0}>
              Continuar
            </Button>
            <Button color="error" onClick={handleCancel} disabled={idStatus === 0}>
              Cancelar
            </Button>
          </DialogActions>
        </Dialog>
      </Grid2>
    )
  );
};

export default EmployeeIncident;
