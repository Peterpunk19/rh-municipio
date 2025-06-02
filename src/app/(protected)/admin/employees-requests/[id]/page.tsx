"use client";

import React, { useState, useCallback } from "react";
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
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import { useParams, useRouter } from "next/navigation";
import { getEmployeeRequestById, updateEmployeeRequest } from "@/services/employee-requests";
import { fetchCatalogData } from "@/services/catalogs";
import { useFetchOptions } from "@/components/customHooks/useFetchOptions";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { formatDate } from "@/utils/formatter";
import { logger } from "@/lib/logger";
import CardContent from "@mui/material/CardContent";
import { generateUniqueKey } from "@/utils";
import CustomSelect from "@/app/components/forms/theme-elements/CustomSelect";
import { IconDownload } from "@tabler/icons-react";
import EmployeeDetails from "@/components/customComponents/EmployeeDetails";
import LoadingComponent from "@/components/customComponents/LoadingComponent";
import RequestDetails from "@/components/customComponents/RequestDetails";
import RequestStatusHistory from "@/components/customComponents/RequestStatusHistory";
import { REQUEST_STATUS_ID } from "@/common/constants/RequestStatus";

const BCrumb = [
  {
    to: "/admin/employees-requests",
    title: "Solicitudes de empleados",
  },
  {
    title: "Detalles de solicitud",
  },
];

const EmployeeRequest = () => {
  const [loading, setLoading] = useState(false);
  const [employeeRequestData, setEmployeeRequestData] = useState<any>(null);
  const { id } = useParams();
  const router = useRouter();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [idStatus, setIdStatus] = React.useState(0);
  const [responseMessage, setResponseMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [data, setData] = useState<any>({});

  const fetchEmployeeRequestById = useCallback(
    (id: any) => {
      try {
        if (id) {
          setLoading(true);
          getEmployeeRequestById(id as string).then((data) => {
            if (data.success) {
              setEmployeeRequestData(data.responseObject);
              setData({
                id: data.responseObject.id,
              });
            } else {
              setEmployeeRequestData(null);
              router.push("/admin/employees-requests");
            }
          });
        }
      } catch (error: any) {
        logger.error({ error: error.message, stack: error.stack });
        setLoading(false);
        router.push("/admin/employees-requests");
      }
    },
    [router],
  );

  React.useEffect(() => {
    fetchEmployeeRequestById(id);
  }, [id, fetchEmployeeRequestById]);

  React.useEffect(() => {
    if (employeeRequestData) {
      setLoading(false);
    }
  }, [employeeRequestData]);

  const catalogName = "requests-status";
  const fetchData = useCallback(() => fetchCatalogData(catalogName), []);

  const { options: requestStatus } = useFetchOptions(fetchData);

  const handleChangeStatus = (e: { target: { value: any } }) => {
    setIdStatus(e.target.value);
    setData({ ...data, requestStatusId: e.target.value });
    setOpenDialog(true);
  };

  const handleCancel = () => {
    setData({ ...data, requestStatusId: 0 });
    setOpenDialog(false);
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      const requestData = {
        requestId: employeeRequestData.id,
        statusId: idStatus,
      };

      const response = await updateEmployeeRequest(requestData);

      if (response.success) {
        setResponseMessage(response.message || "Estado actualizado correctamente");
        setIsSuccess(true);
        fetchEmployeeRequestById(id);
      } else {
        setResponseMessage(response.message || "Error al actualizar el estado");
        setIsSuccess(false);
      }
    } catch (err) {
      console.log(err);
      setResponseMessage("Error al actualizar el estado");
      setIsSuccess(false);
    } finally {
      setData({ ...data, requestStatusId: 0 });
      setIdStatus(0);
      setOpenDialog(false);
      setLoading(false);
    }
  };

  if (loading || !employeeRequestData) return <LoadingComponent />;

  return (
    <Grid container spacing={3}>
      <Breadcrumb title="Detalles de solicitud" items={BCrumb} />
      <Grid size={12}>
        <Grid container>
          <Grid size={{ lg: 6, xs: 12 }}>
            <Box>
              <CustomSelect
                value={data.requestStatusId || 0}
                onChange={handleChangeStatus}
                disabled={loading || employeeRequestData?.request_status?.id !== REQUEST_STATUS_ID.CREADA}
                sx={{
                  height: "40px",
                  "& .MuiSelect-select": {
                    paddingTop: "8px",
                    paddingBottom: "8px",
                  },
                }}
              >
                <MenuItem key={generateUniqueKey()} value={0}>
                  Cambiar estatus de solicitud
                </MenuItem>
                {requestStatus.map((item) => (
                  <MenuItem key={generateUniqueKey()} value={item.id}>
                    {item.display_name}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Box>
          </Grid>
          <Grid size={{ lg: 6, xs: 12 }}>
            <Stack direction={{ xs: "column", sm: "row" }} justifyContent="flex-end" sx={{ width: "100%" }}>
              <Box display="flex" gap={1}>
                <Button variant="outlined" color="secondary" startIcon={<IconDownload width={18} />}>
                  Descargar formato
                </Button>
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
              <Box textAlign="left">
                <Typography variant="h5">Oficio: {employeeRequestData.folio}</Typography>
                <Box mt={1}>
                  <Chip
                    size="medium"
                    color="secondary"
                    variant="outlined"
                    label={formatDate(employeeRequestData.created_at, "dd/MM/yyyy HH:mm")}
                  />
                </Box>
              </Box>
              <Box
                sx={{
                  textAlign: {
                    xs: "center",
                    sm: "right",
                  },
                }}
              >
                <Typography variant="h5">Folio: {employeeRequestData.oficio || "PM/OM/DRH/1511/2025"}</Typography>

                <Box mt={1}>
                  <Chip
                    size="medium"
                    color={employeeRequestData.request_status.btn_color}
                    label={employeeRequestData.request_status.display_name}
                  />
                </Box>
              </Box>
            </Stack>
            <Divider />

            <Grid container spacing={3} mt={2} mb={4}>
              <Grid size={6}>
                <EmployeeDetails data={employeeRequestData.employee} />
              </Grid>
              <Grid size={6}>
                <RequestDetails data={employeeRequestData} />
              </Grid>
            </Grid>

            <Grid mb={3} size={12}>
              <Paper variant="outlined" sx={{ height: "100%" }}>
                <Box p={3} display="flex" flexDirection="column" gap="4px" height="100%">
                  <Grid container>
                    <Grid size={{ lg: 12, xs: 12 }} mb={2}>
                      <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
                        JUSTIFICACIÓN
                      </Typography>
                      <Divider />
                    </Grid>
                    <Grid size={{ lg: 9, xs: 12 }}>
                      <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
                        {employeeRequestData.justification}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>

            <Grid size={12}>
              <RequestStatusHistory data={employeeRequestData} />
            </Grid>
          </CardContent>
        </BlankCard>
      </Grid>

      <Dialog open={openDialog} maxWidth="md" disableEscapeKeyDown>
        <DialogTitle id="alert-dialog-title" variant="h5">
          Cambio de estatus de la solicitud
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Está completamente seguro de cambiar el estatus de la solicitud?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleConfirm} autoFocus disabled={idStatus === 0 || loading}>
            {loading ? "Actualizando..." : "Continuar"}
          </Button>
          <Button color="error" onClick={handleCancel} disabled={idStatus === 0 || loading}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default EmployeeRequest;
