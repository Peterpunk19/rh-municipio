"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Visibility, VisibilityOff, Check, Close } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { changeUserPassword } from "@/services/user";

interface PasswordRequirement {
  label: string;
  regex: RegExp;
  met: boolean;
}

const AuthChangePassword = () => {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const passwordRequirements: PasswordRequirement[] = [
    { label: "Mínimo 8 caracteres", regex: /.{8,}/, met: newPassword.length >= 8 },
    { label: "Máximo 30 caracteres", regex: /^.{0,30}$/, met: newPassword.length <= 30 },
    { label: "Al menos una letra mayúscula", regex: /[A-Z]/, met: /[A-Z]/.test(newPassword) },
    { label: "Al menos una letra minúscula", regex: /[a-z]/, met: /[a-z]/.test(newPassword) },
    { label: "Al menos un número", regex: /[0-9]/, met: /[0-9]/.test(newPassword) },
    {
      label: "Al menos un carácter especial (!@#$%^&*,._-=?)",
      regex: /[!@#$%^&*,._\-=?]/,
      met: /[!@#$%^&*,._\-=?]/.test(newPassword),
    },
  ];

  const allRequirementsMet = passwordRequirements.every((req) => req.met);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: Record<string, string> = {};

    if (!currentPassword) {
      errors.currentPassword = "La contraseña actual es requerida";
    }

    if (!allRequirementsMet) {
      errors.newPassword = "La contraseña no cumple con los requisitos";
    }

    if (!passwordsMatch) {
      errors.confirmPassword = "Las contraseñas no coinciden";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    setLoading(true);
    setError("");

    try {
      const response = await changeUserPassword({
        currentPassword,
        newPassword,
        confirmNewPassword: confirmPassword,
      });

      if (response.success) {
        router.replace("/login?message=password_changed");
        return;
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
            setError(response.message || "Error al cambiar la contraseña");
          }
        } else {
          setError(response.message || "Error al cambiar la contraseña");
        }
      }
    } catch (err: any) {
      setError(err.message || "Error al cambiar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Stack spacing={2.5}>
        <Box>
          <Typography variant="body2" fontWeight={500} mb={0.5}>
            Contraseña Actual (Temporal)
          </Typography>
          <TextField
            fullWidth
            type={showCurrentPassword ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            error={!!validationErrors.currentPassword}
            helperText={validationErrors.currentPassword}
            placeholder="Ingresa tu contraseña temporal"
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
            placeholder="Ingresa tu nueva contraseña"
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

        {newPassword.length > 0 && (
          <Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 1 }}>
            <Typography variant="caption" fontWeight={600} color="text.secondary" mb={1} display="block">
              Requisitos de contraseña:
            </Typography>
            <List dense disablePadding>
              {passwordRequirements.map((req, index) => (
                <ListItem key={index} disablePadding sx={{ py: 0.25 }}>
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    {req.met ? <Check fontSize="small" color="success" /> : <Close fontSize="small" color="error" />}
                  </ListItemIcon>
                  <ListItemText
                    primary={req.label}
                    primaryTypographyProps={{
                      variant: "caption",
                      color: req.met ? "success.main" : "error.main",
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        <Box>
          <Typography variant="body2" fontWeight={500} mb={0.5}>
            Confirmar Nueva Contraseña
          </Typography>
          <TextField
            fullWidth
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!validationErrors.confirmPassword || (confirmPassword.length > 0 && !passwordsMatch)}
            helperText={
              validationErrors.confirmPassword ||
              (confirmPassword.length > 0 && !passwordsMatch ? "Las contraseñas no coinciden" : "")
            }
            placeholder="Confirma tu nueva contraseña"
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

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          disabled={!currentPassword || !allRequirementsMet || !passwordsMatch || loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Cambiar Contraseña"}
        </Button>
      </Stack>
    </Box>
  );
};

export default AuthChangePassword;
