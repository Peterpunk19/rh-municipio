"use client";
import React, { useState, useEffect } from "react";
import ParentCard from "@/app/components/shared/ParentCard";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomSelect from "@/app/components/forms/theme-elements/CustomSelect";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  Grid2,
  IconButton,
  InputAdornment,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import CustomOutlinedInput from "@/app/components/forms/theme-elements/CustomOutlinedInput";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { fetchRolesData, fetchSecretariasData, fetchDireccionesData } from "@/services/catalogs";
import { useFetchOptions } from "@/components/customHooks/useFetchOptions";
import { createUser } from "@/services/user";
import { FormErrors, initialFormData } from "./dataConfig";
import CustomLabelError from "@/components/theme-elements/CustomLabelError";
import Link from "next/link";
import { isRoleExcluded, ROLES, ROLES_ID_VALUES } from "@/common/constants/Roles";
import { logger } from "@/lib/logger";

const UserCreateForm = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [responseMessage, setResponseMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [secretarias, setSecretarias] = useState<any[]>([]);
  const [loadingSecretarias, setLoadingSecretarias] = useState<boolean>(false);
  const [secretariasError, setSecretariasError] = useState<boolean>(false);
  const [showSecretarias, setShowSecretarias] = useState<boolean>(false);

  const [direcciones, setDirecciones] = useState<any[]>([]);
  const [loadingDirecciones, setLoadingDirecciones] = useState<boolean>(false);
  const [direccionesError, setDireccionesError] = useState<boolean>(false);
  const [showDirecciones, setShowDirecciones] = useState<boolean>(false);
  const [selectedDirecciones, setSelectedDirecciones] = useState<string[]>([]);

  const handleChange = async (event: any) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    const isRoleId = name === "role_id";
    const isSecretariaId = name === "secretaria_id";
    const roleValue = parseInt(value);
    const ENLACE_ID = ROLES_ID_VALUES[ROLES.ENLACE as keyof typeof ROLES_ID_VALUES];
    const SUBENLACE_ID = ROLES_ID_VALUES[ROLES.SUBENLACE as keyof typeof ROLES_ID_VALUES];

    if (isRoleId && (roleValue === ENLACE_ID || roleValue === SUBENLACE_ID)) {
      setShowSecretarias(true);
      setLoadingSecretarias(true);
      setSecretariasError(false);
      setShowDirecciones(false);
      setSelectedDirecciones([]);

      try {
        const response = await fetchSecretariasData();
        if (response?.success && response.responseObject) {
          setSecretarias(response.responseObject);
        } else {
          setSecretariasError(true);
        }
      } catch (error) {
        logger.error("Error al cargar secretarías:", error);
        setSecretariasError(true);
      } finally {
        setLoadingSecretarias(false);
      }
    } else if (isRoleId) {
      setShowSecretarias(false);
      setShowDirecciones(false);
      setSelectedDirecciones([]);

      if (formData.secretaria_id) {
        setFormData((prev) => ({
          ...prev,
          secretaria_id: 0,
        }));
      }
    } else if (isSecretariaId && value !== "0") {
      setShowDirecciones(true);
      setLoadingDirecciones(true);
      setDireccionesError(false);
      setSelectedDirecciones([]);

      try {
        const response = await fetchDireccionesData(value.toString());
        if (response?.success && response.responseObject) {
          setDirecciones(response.responseObject);
        } else {
          setDireccionesError(true);
        }
      } catch (error) {
        logger.error("Error al cargar direcciones:", error);
        setDireccionesError(true);
      } finally {
        setLoadingDirecciones(false);
      }
    } else if (isSecretariaId) {
      setShowDirecciones(false);
      setSelectedDirecciones([]);
    }
  };

  const handleDireccionesChange = (event: SelectChangeEvent<typeof selectedDirecciones>) => {
    const { value } = event.target;
    setSelectedDirecciones(typeof value === "string" ? value.split(",") : value);

    const direccionesIds =
      typeof value === "string" ? value.split(",").map((id) => Number(id)) : value.map((id) => Number(id));

    setFormData((prev) => ({
      ...prev,
      direcciones_ids: direccionesIds,
    }));
  };

  const { options: roles, isLoading, error } = useFetchOptions(fetchRolesData);

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const resetFormValues = () => {
    setFormData(initialFormData);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setOpenDialog(true);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setErrors({});
    try {
      const response = await createUser(formData);
      if (!response.success) {
        if (response && response.responseObject) {
          const newErrors: FormErrors = {};
          for (const key in response.responseObject) {
            if (response.responseObject[key].messages && response.responseObject[key].messages.length > 0) {
              newErrors[key] = response.responseObject[key].messages;
            }
          }
          setErrors(newErrors);
          setResponseMessage(response.message);
          setIsSuccess(false);
        } else {
          throw new Error("Failed to submit form. Please try again.");
        }
        return;
      } else {
        setIsSuccess(true);
        setResponseMessage(response.message);
        resetFormValues();
        setTimeout(() => {
          window.location.href = "/admin/users";
        }, 3000);
      }
    } catch (err) {
      setResponseMessage("Hubo un error inesperado.");
    } finally {
      setIsSubmitting(false);
      setOpenDialog(false);
    }
  };

  const handlePreventClose = (reason: string) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      return;
    }
  };

  const handleCancel = () => {
    setOpenDialog(false);
  };

  return (
    <ParentCard title="Rellena los datos">
      <Box>
        <Typography variant="h6" mb={1}>
          Información Personal
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <CustomFormLabel>Usuario</CustomFormLabel>
                <CustomTextField
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  inputProps={{ maxLength: 255, autoComplete: "off" }}
                ></CustomTextField>
                <CustomLabelError field={errors.username && errors.username} />
              </FormControl>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <CustomFormLabel htmlFor="fs-pwd">Contraseña</CustomFormLabel>
                <CustomOutlinedInput
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="click para visualizar la contraseña"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <IconEyeOff size="20" /> : <IconEye size="20" />}
                      </IconButton>
                    </InputAdornment>
                  }
                  id="fs-pwd"
                  placeholder="*******"
                  fullWidth
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  inputProps={{ maxLength: 255, autoComplete: "off" }}
                />
                <CustomLabelError field={errors.password} />
              </FormControl>
            </Grid2>
            <Grid2 mt={2} size={12}>
              <Divider sx={{ mx: "-24px" }} />
              <Typography variant="h6" mt={2}>
                Detalles de Usuario
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <CustomFormLabel>Rol</CustomFormLabel>
                <CustomSelect
                  fullWidth
                  name="role_id"
                  value={formData.role_id}
                  onChange={handleChange}
                  disabled={isLoading || error}
                >
                  <MenuItem key="default" value="0">
                    Selecciona un rol para el usuario
                  </MenuItem>
                  {isLoading ? (
                    <MenuItem disabled> Cargando...</MenuItem>
                  ) : error ? (
                    <MenuItem disabled>Error al cargar</MenuItem>
                  ) : (
                    roles?.map((rol) => {
                      if (isRoleExcluded(rol.name as any, "USER_CREATION")) return null;
                      return (
                        <MenuItem key={rol.id} value={rol.id}>
                          {rol.display_name}
                        </MenuItem>
                      );
                    })
                  )}
                </CustomSelect>
                <CustomLabelError field={errors.role_id} />
              </FormControl>
            </Grid2>
            {showSecretarias && (
              <Grid2 size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <CustomFormLabel>Secretaría</CustomFormLabel>
                  {loadingSecretarias ? (
                    <Box display="flex" alignItems="center" justifyContent="center" py={2}>
                      <CircularProgress size={24} />
                      <Typography variant="body2" ml={1}>
                        Cargando secretarías...
                      </Typography>
                    </Box>
                  ) : (
                    <CustomSelect
                      fullWidth
                      name="secretaria_id"
                      value={formData.secretaria_id || "0"}
                      onChange={handleChange}
                      disabled={secretariasError}
                    >
                      <MenuItem key="default" value="0">
                        Selecciona una secretaría
                      </MenuItem>
                      {secretariasError ? (
                        <MenuItem disabled>Error al cargar</MenuItem>
                      ) : (
                        secretarias.map((secretaria) => (
                          <MenuItem key={secretaria.id} value={secretaria.id}>
                            {secretaria.display_name}
                          </MenuItem>
                        ))
                      )}
                    </CustomSelect>
                  )}
                  <CustomLabelError field={errors.secretaria_id} />
                </FormControl>
              </Grid2>
            )}

            {showDirecciones && (
              <Grid2 size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <CustomFormLabel>Direcciones(Puedes seleccionar múltiples)</CustomFormLabel>
                  {loadingDirecciones ? (
                    <Box display="flex" alignItems="center" justifyContent="center" py={2}>
                      <CircularProgress size={24} />
                      <Typography variant="body2" ml={1}>
                        Cargando direcciones...
                      </Typography>
                    </Box>
                  ) : (
                    <Select
                      fullWidth
                      multiple
                      value={selectedDirecciones}
                      onChange={handleDireccionesChange}
                      input={<OutlinedInput />}
                      disabled={direccionesError}
                      renderValue={(selected) => (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                          {selected.map((value) => {
                            const direccion = direcciones.find((dir) => dir.id.toString() === value);
                            return <Chip key={value} label={direccion ? direccion.display_name : value} size="small" />;
                          })}
                        </Box>
                      )}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 224,
                            width: 250,
                          },
                        },
                      }}
                    >
                      {direccionesError ? (
                        <MenuItem disabled>Error al cargar direcciones</MenuItem>
                      ) : direcciones.length === 0 ? (
                        <MenuItem disabled>No hay direcciones disponibles</MenuItem>
                      ) : (
                        direcciones.map((direccion) => (
                          <MenuItem key={direccion.id} value={direccion.id.toString()}>
                            <Checkbox checked={selectedDirecciones.indexOf(direccion.id.toString()) > -1} />
                            <ListItemText primary={direccion.display_name} />
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  )}
                  <CustomLabelError
                    field={
                      errors.direcciones_ids
                        ? Array.isArray(errors.direcciones_ids)
                          ? errors.direcciones_ids.join(", ")
                          : errors.direcciones_ids
                        : undefined
                    }
                  />
                </FormControl>
              </Grid2>
            )}
            <Grid2 size={12}>
              <Grid2 size={12} sx={{ mb: 2 }}>
                {responseMessage && (
                  <Alert severity={isSuccess ? "success" : "error"}>
                    <Typography variant="body1" fontWeight={600}>
                      {responseMessage}
                    </Typography>
                  </Alert>
                )}
              </Grid2>
              <Stack direction="row" justifyContent="flex-end" spacing={2}>
                <Link href={"/admin/users"} passHref>
                  <Button variant="contained" color="error" sx={{ display: "flex" }}>
                    Salir
                  </Button>
                </Link>
                <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                  Guardar
                </Button>
              </Stack>
            </Grid2>
          </Grid2>
        </form>
      </Box>

      <Dialog open={openDialog} onClose={handlePreventClose} maxWidth="sm" disableEscapeKeyDown>
        <DialogTitle id="alert-dialog-title" variant="h5">
          {"Creación de nuevo usuario"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">¿Desea continuar?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="error" variant="contained" disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} color="primary" variant="contained" autoFocus disabled={isSubmitting}>
            Continuar
          </Button>
        </DialogActions>
      </Dialog>
    </ParentCard>
  );
};
export default UserCreateForm;
