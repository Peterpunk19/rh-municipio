import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid2 as Grid,
  Divider,
  CircularProgress,
  Alert,
  Stack,
  Box,
  FormControlLabel,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/es";
import EmployeeFinder from "@/components/shared/EmployeeFinder";
import { updateLeader } from "@/services/administratives-organizations";
import { logger } from "@/lib/logger";
import { DirectorFormProps, FormErrors } from "@/interfaces/AdministrativeOrganization";
import CustomLabelError from "@/components/theme-elements/CustomLabelError";
import { getEmployeeById } from "@/services/employees";
import CustomRadio from "@/app/components/forms/theme-elements/CustomRadio";
dayjs.extend(utc);
dayjs.locale("es");

export default function DirectorFormDialog({ open, onClose, onSave, secretaria, direccion }: DirectorFormProps) {
  const [form, setForm] = useState({
    director_id: "",
    deputy_director_id: "",
    startDate: "",
    endDate: "",
    direccion_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [directorEmployee, setDirectorEmployee] = useState<any>(null);
  const [deputyDirectorEmployee, setDeputyDirectorEmployee] = useState<any>(null);

  const fetchEmployeeData = async (employeeId: string) => {
    if (!employeeId) return null;
    try {
      const response = await getEmployeeById(employeeId);
      if (response.success && response.responseObject) {
        const responseDate = {
          id: response.responseObject.id,
          label:
            `${response.responseObject.name} ${response.responseObject.paternal_last_name} ${response.responseObject.maternal_last_name} - ${response.responseObject.number_employee}` ||
            "",
          number_employee: response.responseObject.number_employee || "",
          rfc: response.responseObject.rfc || "",
          curp: response.responseObject.curp || "",
          direccion_display_name: response.responseObject.employee_hiring[0]?.direccion?.display_name || "",
          secretaria_display_name:
            response.responseObject.employee_hiring[0]?.direccion?.secretaria?.display_name || "",
          category_display_name: response.responseObject.employee_hiring[0]?.category?.display_name || "",
          employee_type_display_name: response.responseObject.employee_hiring[0]?.employee_type?.display_name || "",
          location_display_name: response.responseObject.employee_location[0]?.location?.display_name || "",
          attendance_type_display_name:
            response.responseObject.employee_attendance_type[0]?.attendance?.display_name || "",
        };
        return responseDate;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  useEffect(() => {
    if (open) {
      setInitialLoading(true);
      let director = direccion?.director;
      let deputyDirector = direccion?.deputy_director;
      let organizationId = direccion?.id;
      if (director) {
        const formData = {
          director_id: director?.id ? String(director.id) : "",
          deputy_director_id: deputyDirector?.id ? String(deputyDirector.id) : "",
          startDate: director?.startDate || "",
          endDate: director?.endDate || "",
          direccion_id: organizationId ? String(organizationId) : "",
        };

        if (formData.startDate) {
          formData.startDate = dayjs(formData.startDate).utc().format("YYYY-MM-DD");
        }

        if (formData.endDate) {
          formData.endDate = dayjs(formData.endDate).utc().format("YYYY-MM-DD");
        }
        setForm(formData);

        const loadEmployeeData = async () => {
          try {
            const promises = [];
            if (director?.id) {
              promises.push(
                fetchEmployeeData(String(director.id)).then((employeeData) => {
                  if (employeeData) {
                    setDirectorEmployee(employeeData);
                  }
                }),
              );
            }

            if (deputyDirector?.id) {
              promises.push(
                fetchEmployeeData(String(deputyDirector.id)).then((employeeData) => {
                  if (employeeData) {
                    setDeputyDirectorEmployee(employeeData);
                  }
                }),
              );
            }

            await Promise.all(promises);
          } catch (error) {
            console.log(error);
          } finally {
            setInitialLoading(false);
          }
        };

        loadEmployeeData();
      } else {
        setInitialLoading(false);
      }
    }
  }, [open, direccion]);

  const handleDirectorSelect = (employee: any) => {
    if (employee) {
      setDirectorEmployee(employee);
      setForm((prev) => ({ ...prev, director_id: employee.id }));
    } else {
      setDirectorEmployee(null);
      setForm((prev) => ({ ...prev, director_id: "" }));
    }
  };

  const handleDeputyDirectorSelect = (employee: any) => {
    if (employee) {
      setDeputyDirectorEmployee(employee);
      setForm((prev) => ({ ...prev, deputy_director_id: employee.id }));
    } else {
      setDeputyDirectorEmployee(null);
      setForm((prev) => ({ ...prev, deputy_director_id: "" }));
    }
  };

  const handleDateChange = (name: string) => (value: dayjs.Dayjs | null) => {
    setForm((prev) => ({
      ...prev,
      [name]: value && value.isValid() ? value.format("YYYY-MM-DD") : "",
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const newErrors: FormErrors = {};

      if (!form.startDate) {
        newErrors.startDate = "La fecha de inicio es requerida";
      }

      if (!form.endDate) {
        newErrors.endDate = "La fecha de fin es requerida";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setLoading(false);
        return;
      }

      const startDate = dayjs(form.startDate);
      const endDate = dayjs(form.endDate);

      if (!startDate.isValid() || !endDate.isValid()) {
        if (!startDate.isValid()) newErrors.startDate = "La fecha de inicio no es válida";
        if (!endDate.isValid()) newErrors.endDate = "La fecha de fin no es válida";
        setErrors(newErrors);
        setLoading(false);
        return;
      }

      if (startDate.isSame(endDate, "day")) {
        newErrors.endDate = "La fecha de fin no puede ser igual a la fecha de inicio";
        setErrors(newErrors);
        setLoading(false);
        return;
      }

      if (endDate.isBefore(startDate)) {
        newErrors.endDate = "La fecha de fin no puede ser anterior a la fecha de inicio";
        setErrors(newErrors);
        setLoading(false);
        return;
      }

      const payload = {
        direccionId: Number(form.direccion_id),
        director: Number(form.director_id),
        deputyDirector: Number(form.deputy_director_id) || null,
        startDate: startDate.format("YYYY-MM-DD"),
        endDate: endDate.format("YYYY-MM-DD"),
      };

      const response = await updateLeader(payload);
      if (!response.success) {
        if (response && response.responseObject) {
          const newErrors: FormErrors = {};
          for (const key in response.responseObject) {
            if (response.responseObject[key].messages && response.responseObject[key].messages.length > 0) {
              newErrors[key] = response.responseObject[key].messages[0];
            }
          }
          setMessage(response.message);
          setErrors(newErrors);
          setSuccess(false);
        } else {
          throw new Error("Failed to submit form. Please try again.");
        }
        return;
      } else {
        setSuccess(true);
        setMessage(response.message);
        setTimeout(() => {
          onSave(response.responseObject);
          onClose();
          resetForm();
        }, 2500);
      }
    } catch (err: any) {
      logger.error({ error: err.message });
      setMessage(err.message || "Error al guardar el director");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      director_id: "",
      deputy_director_id: "",
      startDate: "",
      endDate: "",
      direccion_id: "",
    });
    setDirectorEmployee(null);
    setDeputyDirectorEmployee(null);
    setErrors({});
    setMessage(null);
    setSuccess(false);
    setLoading(false);
  };

  const handleClose = (_event: React.SyntheticEvent, reason: string) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      return;
    }
    resetForm();
    onClose();
  };

  const handleButtonClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth disableEscapeKeyDown>
      <DialogTitle>
        {secretaria} - {direccion?.name}
      </DialogTitle>
      {initialLoading ? (
        <Grid container justifyContent="center" alignItems="center" sx={{ py: 8 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>
            Cargando información...
          </Typography>
        </Grid>
      ) : (
        <>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }} sx={{ mt: 2 }}>
                <EmployeeFinder
                  onEmployeeSelect={handleDirectorSelect}
                  error={""}
                  label="Secretario"
                  initialEmployee={directorEmployee}
                />
                <CustomLabelError field={errors.director && errors.director} />
              </Grid>
              <Grid size={{ xs: 6 }} sx={{ mt: 2 }}>
                <EmployeeFinder
                  onEmployeeSelect={handleDirectorSelect}
                  error={""}
                  label="Director"
                  initialEmployee={directorEmployee}
                />
                <CustomLabelError field={errors.director && errors.director} />
              </Grid>
              <Grid size={{ xs: 6 }} sx={{ mt: 2 }}>
                <EmployeeFinder
                  onEmployeeSelect={handleDeputyDirectorSelect}
                  error=""
                  label="Coordinador"
                  initialEmployee={deputyDirectorEmployee}
                />
                <CustomLabelError field={errors.deputyDirector && errors.deputyDirector} />
              </Grid>
              <Grid size={{ xs: 6 }} sx={{ mt: 2 }}>
                <EmployeeFinder
                  onEmployeeSelect={handleDirectorSelect}
                  error={""}
                  label="Responsable inmediato"
                  initialEmployee={directorEmployee}
                />
                <CustomLabelError field={errors.director && errors.director} />
              </Grid>
              <Grid size={{ xs: 6 }} sx={{ mt: 2 }}>
                <Typography variant="body1" fontWeight="bold" sx={{ mb: 2 }}>
                  ¿Quien firma las incidencias?
                </Typography>
                <Box
                  sx={{
                    textAlign: "left",
                  }}
                >
                  <FormControlLabel control={<CustomRadio color="primary" />} label="Secretario" labelPlacement="end" />
                  <FormControlLabel control={<CustomRadio color="primary" />} label="Director" labelPlacement="end" />
                  <FormControlLabel
                    control={<CustomRadio color="primary" />}
                    label="Coordinador"
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    control={<CustomRadio color="primary" />}
                    label="Responsable inmediato"
                    labelPlacement="end"
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 6 }} sx={{ mt: 2 }}>
                <Typography variant="body1" fontWeight="bold" sx={{ mb: 2 }}>
                  ¿Quien firma las solicitudes?
                </Typography>
                <Box
                  sx={{
                    textAlign: "left",
                  }}
                >
                  <FormControlLabel control={<CustomRadio color="primary" />} label="Secretario" labelPlacement="end" />
                  <FormControlLabel control={<CustomRadio color="primary" />} label="Director" labelPlacement="end" />
                  <FormControlLabel
                    control={<CustomRadio color="primary" />}
                    label="Coordinador"
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    control={<CustomRadio color="primary" />}
                    label="Responsable inmediato"
                    labelPlacement="end"
                  />
                </Box>
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1" fontWeight="bold" sx={{ mb: 2 }}>
              Periodo del Cargo
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                  <DatePicker
                    name="startDate"
                    value={form.startDate && dayjs(form.startDate).isValid() ? dayjs(form.startDate) : null}
                    onChange={handleDateChange("startDate")}
                    label="Fecha de Inicio"
                    sx={{ width: "100%" }}
                  />
                  <CustomLabelError field={errors.startDate && errors.startDate} />
                </LocalizationProvider>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                  <DatePicker
                    name="endDate"
                    value={form.endDate && dayjs(form.endDate).isValid() ? dayjs(form.endDate) : null}
                    onChange={handleDateChange("endDate")}
                    label="Fecha de Fin"
                    sx={{ width: "100%" }}
                  />
                  <CustomLabelError field={errors.endDate && errors.endDate} />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ flexDirection: "column", alignItems: "stretch", padding: 2 }}>
            {message && (
              <Alert severity={success ? "success" : "error"} sx={{ mb: 2, width: "100%" }}>
                <Typography variant="body1" fontWeight={600}>
                  {message}
                </Typography>
              </Alert>
            )}
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button onClick={handleButtonClose} variant="outlined" color="warning" disabled={loading}>
                Cerrar
              </Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {loading ? "Guardando..." : "Guardar"}
              </Button>
            </Stack>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
