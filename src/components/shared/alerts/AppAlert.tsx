"use client";

import React, { useEffect } from "react";
import { IconX } from "@tabler/icons-react";
import { Box, Collapse, Alert, AlertProps, AlertColor, IconButton } from "@mui/material";

interface AppAlertProps extends Omit<AlertProps, "severity"> {
  message: string;
  severity?: AlertColor;
  onClose?: () => void;
  open?: boolean;
  autoHideDuration?: number;
  title?: string;
}

const AppAlert: React.FC<AppAlertProps> = ({
  message,
  severity = "info",
  onClose,
  open = true,
  autoHideDuration = 5000,
  title,
  ...props
}) => {
  const [isOpen, setIsOpen] = React.useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  useEffect(() => {
    if (isOpen && autoHideDuration > 0) {
      const timer = setTimeout(() => {
        setIsOpen(false);
        onClose?.();
      }, autoHideDuration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoHideDuration, onClose]);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 20,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1400,
        width: "100%",
        maxWidth: 600,
        px: 2,
      }}
    >
      <Collapse in={isOpen}>
        <Alert
          variant="filled"
          severity={severity}
          sx={{
            width: "100%",
            "& .MuiAlert-message": {
              width: "100%",
            },
          }}
          action={
            <IconButton aria-label="close" color="inherit" size="small" onClick={handleClose}>
              <IconX width={20} />
            </IconButton>
          }
          {...props}
        >
          {title && (
            <Box fontWeight="bold" mb={0.5}>
              {title}
            </Box>
          )}
          {message}
        </Alert>
      </Collapse>
    </Box>
  );
};

export default AppAlert;
