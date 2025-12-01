"use client";

import * as React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Paper,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ROLES_ID_VALUES, ROLES } from "@/common/constants/Roles";
import { resetUserPassword, changeUserPassword } from "@/services/user";

interface SecurityTabProps {
  userData: User | null;
}

const generateTemporaryPassword = (): string => {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const special = "!@#$%^&*,._-=?";
  const all = uppercase + lowercase + numbers + special;

  let password = "";
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];

  for (let i = 4; i < 12; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }

  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
};

const SecurityTab = ({ userData }: SecurityTabProps) => {
  const { user } = useCurrentUser();
  // Check if current user is admin (role can be string "1" or number 1)
  const isAdmin = Number(user?.role) === ROLES_ID_VALUES[ROLES.ADMIN];
  const isViewingOwnProfile = user?.id === userData?.id?.toString();
  // Admin can reset password for non-admin users when not viewing own profile
  const canResetPassword = isAdmin && !isViewingOwnProfile && userData?.role_id !== ROLES_ID_VALUES[ROLES.ADMIN];
  // Show change password only for viewing own profile
  const showChangePassword = isViewingOwnProfile;

  // Admin Reset Password State
  const [temporaryPassword, setTemporaryPassword] = React.useState("");
  const [showTemporaryPassword, setShowTemporaryPassword] = React.useState(false);
  const [resetLoading, setResetLoading] = React.useState(false);
  const [resetSuccess, setResetSuccess] = React.useState(false);
  const [resetError, setResetError] = React.useState("");
  const [generatedPassword, setGeneratedPassword] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  // Change Password State
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [changeLoading, setChangeLoading] = React.useState(false);
  const [changeSuccess, setChangeSuccess] = React.useState(false);
  const [changeError, setChangeError] = React.useState("");
  const [validationErrors, setValidationErrors] = React.useState<Record<string, string>>({});

  const handleGeneratePassword = () => {
    const newTempPassword = generateTemporaryPassword();
    setTemporaryPassword(newTempPassword);
    setResetSuccess(false);
    setResetError("");
    setGeneratedPassword("");
  };

  const validateTempPassword = (password: string): string | null => {
    if (password.length < 8) return "La contraseña debe tener al menos 8 caracteres";
    if (!/[A-Z]/.test(password)) return "La contraseña debe contener al menos una letra mayúscula";
    if (!/[a-z]/.test(password)) return "La contraseña debe contener al menos una letra minúscula";
    if (!/[0-9]/.test(password)) return "La contraseña debe contener al menos un número";
    return null;
  };

  const handleResetPassword = async () => {
    if (!userData?.id || !temporaryPassword) return;

    // Validate password before sending
    const validationError = validateTempPassword(temporaryPassword);
    if (validationError) {
      setResetError(validationError);
      return;
    }

    setResetLoading(true);
    setResetError("");
    setResetSuccess(false);

    try {
      const response = await resetUserPassword({
        userId: userData.id,
        password: temporaryPassword,
      });

      if (response.success) {
        setResetSuccess(true);
        setGeneratedPassword(temporaryPassword);
        setTemporaryPassword("");
      } else {
        // Handle validation errors from API
        if (response.responseObject && typeof response.responseObject === "object" && Object.keys(response.responseObject).length > 0) {
          const errorMessages: string[] = [];
          for (const [field, value] of Object.entries(response.responseObject)) {
            if ((value as any)?.messages && Array.isArray((value as any).messages)) {
              // Add field context if it's password field
              const messages = (value as any).messages as string[];
              if (field === "password") {
                errorMessages.push(...messages.map((msg: string) => `• ${msg}`));
              } else {
                errorMessages.push(...messages);
              }
            }
          }
          if (errorMessages.length > 0) {
            setResetError(`La contraseña no cumple con los requisitos:\n${errorMessages.join("\n")}`);
          } else {
            setResetError(response.message || "Error al resetear la contraseña");
          }
        } else {
          setResetError(response.message || "Error al resetear la contraseña");
        }
      }
    } catch (error: any) {
      setResetError(error.message || "Error al resetear la contraseña");
    } finally {
      setResetLoading(false);
    }
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(generatedPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 8) errors.push("Mínimo 8 caracteres");
    if (password.length > 30) errors.push("Máximo 30 caracteres");
    if (!/[A-Z]/.test(password)) errors.push("Al menos una letra mayúscula");
    if (!/[a-z]/.test(password)) errors.push("Al menos una letra minúscula");
    if (!/[0-9]/.test(password)) errors.push("Al menos un número");
    if (!/[!@#$%^&*,._\-=?]/.test(password)) errors.push("Al menos un carácter especial (!@#$%^&*,._-=?)");
    return errors;
  };

  const handleChangePassword = async () => {
    const errors: Record<string, string> = {};

    if (!currentPassword) {
      errors.currentPassword = "La contraseña actual es requerida";
    }

    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      errors.newPassword = passwordErrors.join(", ");
    }

    if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    setChangeLoading(true);
    setChangeError("");
    setChangeSuccess(false);

    try {
      const response = await changeUserPassword({
        currentPassword,
        newPassword,
        confirmNewPassword: confirmPassword,
      });

      if (response.success) {
        setChangeSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        if (response.responseObject && typeof response.responseObject === "object") {
          const fieldErrors: Record<string, string> = {};
          for (const [key, value] of Object.entries(response.responseObject)) {
            if ((value as any)?.messages) {
              fieldErrors[key] = (value as any).messages.join(", ");
            }
          }
          if (Object.keys(fieldErrors).length > 0) {
            setValidationErrors(fieldErrors);
          } else {
            setChangeError(response.message || "Error al cambiar la contraseña");
          }
        } else {
          setChangeError(response.message || "Error al cambiar la contraseña");
        }
      }
    } catch (error: any) {
      setChangeError(error.message || "Error al cambiar la contraseña");
    } finally {
      setChangeLoading(false);
    }
  };

  const handleCancelReset = () => {
    setTemporaryPassword("");
    setResetSuccess(false);
    setResetError("");
    setGeneratedPassword("");
  };

  const handleCancelChange = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setChangeSuccess(false);
    setChangeError("");
    setValidationErrors({});
  };

  return (
    <Box>
      {/* Admin Reset Password Section */}
      {canResetPassword && (
        <Paper elevation={0} sx={{ p: 3, mb: 3, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Resetear contraseña
          </Typography>

          {resetSuccess && generatedPassword && (
            <Alert
              severity="success"
              sx={{ mb: 2 }}
              action={
                <Button
                  color="inherit"
                  size="small"
                  startIcon={<ContentCopyIcon />}
                  onClick={handleCopyPassword}
                >
                  {copied ? "¡Copiado!" : "Copiar"}
                </Button>
              }
            >
              <Typography variant="body2">
                Contraseña temporal generada exitosamente. El usuario deberá cambiarla en su próximo inicio de sesión.
              </Typography>
              <Typography variant="body2" fontWeight={600} sx={{ mt: 1, fontFamily: "monospace" }}>
                {generatedPassword}
              </Typography>
            </Alert>
          )}

          {resetError && (
            <Alert severity="error" sx={{ mb: 2, whiteSpace: "pre-line" }}>
              {resetError}
            </Alert>
          )}

          {!resetSuccess && (
            <>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Ingrese una contraseña temporal:
              </Typography>

              <Box display="flex" gap={1} mb={2}>
                <TextField
                  fullWidth
                  type={showTemporaryPassword ? "text" : "password"}
                  value={temporaryPassword}
                  onChange={(e) => setTemporaryPassword(e.target.value)}
                  placeholder="********"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowTemporaryPassword(!showTemporaryPassword)} edge="end">
                            {showTemporaryPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <Button variant="outlined" onClick={handleGeneratePassword} sx={{ whiteSpace: "nowrap" }}>
                  Generar
                </Button>
              </Box>

              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
                Requisitos: mínimo 8 caracteres, una mayúscula, una minúscula y un número.
              </Typography>

              <Box display="flex" justifyContent="flex-end" gap={1}>
                <Button 
                  variant="outlined" 
                  sx={{ 
                    color: "error.main", 
                    borderColor: "error.light",
                    "&:hover": { borderColor: "error.main", bgcolor: "error.50" }
                  }} 
                  onClick={handleCancelReset} 
                  disabled={resetLoading}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleResetPassword}
                  disabled={!temporaryPassword || resetLoading}
                >
                  {resetLoading ? <CircularProgress size={24} /> : "Resetear"}
                </Button>
              </Box>
            </>
          )}
        </Paper>
      )}

      {/* Change Password Section */}
      {showChangePassword && (
        <Paper elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
          <Typography variant="h6" fontWeight={600} mb={1}>
            Cambiar Contraseña
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={3}>
            Para cambiar tu contraseña, confirma aquí
          </Typography>

          {changeSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Contraseña cambiada exitosamente
            </Alert>
          )}

          {changeError && (
            <Alert severity="error" sx={{ mb: 2, whiteSpace: "pre-line" }}>
              {changeError}
            </Alert>
          )}

          <Box display="flex" flexDirection="column" gap={2} mb={3}>
            <Box>
              <Typography variant="body2" fontWeight={500} mb={0.5}>
                Contraseña Actual
              </Typography>
              <TextField
                fullWidth
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                error={!!validationErrors.currentPassword}
                helperText={validationErrors.currentPassword}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowCurrentPassword(!showCurrentPassword)} edge="end">
                          {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            <Box>
              <Typography variant="body2" fontWeight={500} mb={0.5}>
                Nueva Contraseña
              </Typography>
              <TextField
                fullWidth
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                error={!!validationErrors.newPassword}
                helperText={validationErrors.newPassword}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            <Box>
              <Typography variant="body2" fontWeight={500} mb={0.5}>
                Confirmar Contraseña
              </Typography>
              <TextField
                fullWidth
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={!!validationErrors.confirmPassword}
                helperText={validationErrors.confirmPassword}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>
          </Box>

          <Box display="flex" justifyContent="flex-end" gap={1}>
            <Button 
              variant="outlined" 
              sx={{ 
                color: "error.main", 
                borderColor: "error.light",
                "&:hover": { borderColor: "error.main", bgcolor: "error.50" }
              }}
              onClick={handleCancelChange} 
              disabled={changeLoading}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleChangePassword}
              disabled={!currentPassword || !newPassword || !confirmPassword || changeLoading}
            >
              {changeLoading ? <CircularProgress size={24} /> : "Resetear"}
            </Button>
          </Box>
        </Paper>
      )}

      {/* Message if user cannot see any section */}
      {!canResetPassword && !showChangePassword && (
        <Box textAlign="center" py={4}>
          <Typography variant="body1" color="text.secondary">
            No hay opciones de seguridad disponibles para este usuario.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default SecurityTab;
