"use client";
import { CheckCircle2Icon } from "lucide-react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
} from "@mui/material";

interface ActionButton {
  label: string;
  onClick: () => void;
  variant?: "contained" | "outlined" | "text";
  color?: "primary" | "secondary" | "error";
  primary?: boolean;
}

interface Props {
  open: boolean;
  title: string;
  message: string;
  actions: ActionButton[];
}

export const SuccessActionDialog = ({
                                      open,
                                      title,
                                      message,
                                      actions,
                                    }: Props) => {
  return (
    <Dialog
      open={open}
      onClose={() => {}}
      disableEscapeKeyDown
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle
        variant="h5"
        color="primary"
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        <CheckCircle2Icon className="h-6 w-6" />
        {title}
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" sx={{ mt: 1 }}>
          {message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          justifyContent="flex-end"
          width="100%"
        >
          {actions.map((action, idx) => (
            <Button
              key={idx}
              variant={action.variant ?? "contained"}
              color={action.color ?? "primary"}
              size="small"
              sx={{
                minWidth: 160,
                ...(action.primary && {
                  fontWeight: 600,
                }),
              }}
              fullWidth={action.primary}
              onClick={action.onClick}
            >
              {action.label}
            </Button>

          ))}
        </Stack>
      </DialogActions>
    </Dialog>
  );
};
