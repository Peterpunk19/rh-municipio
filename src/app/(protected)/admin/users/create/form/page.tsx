"use client";
import React, { useState } from "react";
import ParentCard from "@/app/components/shared/ParentCard";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomSelect from "@/app/components/forms/theme-elements/CustomSelect";
import {
  Alert,
  Box,
  Button,
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
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import CustomOutlinedInput from "@/app/components/forms/theme-elements/CustomOutlinedInput";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { fetchRolesData } from "@/services/catalogs";
import { useFetchOptions } from "@/components/customHooks/useFetchOptions";
import { createUser } from "@/services/user";
import { FormErrors, initialFormData } from "./dataConfig";
import CustomLabelError from "@/components/theme-elements/CustomLabelError";
import Link from "next/link";
const UserCreateForm = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [responseMessage, setResponseMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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
              newErrors[key] = response.responseObject[key].messages[0];
            }
          }
          setErrors(newErrors);
          setResponseMessage(response.message);
          setIsSuccess(false);
        } else {
          throw new Error("Failed to submit form. Please try again.");
        }
        console.log(errors);
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
                    roles?.map((rol) => (
                      <MenuItem key={rol.id} value={rol.id}>
                        {rol.display_name}
                      </MenuItem>
                    ))
                  )}
                </CustomSelect>
                <CustomLabelError field={errors.role_id} />
              </FormControl>
            </Grid2>
            <Grid2 size={12}>
              <Stack direction="row" spacing={2}>
                <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                  Guardar
                </Button>
                <Link href={"/admin/users"} passHref>
                  <Button variant="text" color="error" sx={{ display: "flex" }}>
                    Salir
                  </Button>
                </Link>
              </Stack>
            </Grid2>
            <Grid2 size={12}>
              {responseMessage && (
                <Alert severity={isSuccess ? "success" : "error"}>
                  <Typography variant="body1" fontWeight={600}>
                    {responseMessage}
                  </Typography>
                </Alert>
              )}
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
          <Button onClick={handleConfirm} color="primary" autoFocus disabled={isSubmitting}>
            Continuar
          </Button>
          <Button onClick={handleCancel} color="error" disabled={isSubmitting}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </ParentCard>
  );
};
export default UserCreateForm;
