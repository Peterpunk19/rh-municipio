"use client";

import React, { useState, useCallback } from "react";
import { Button, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import { IconChevronDown, IconUser, IconUserCog, IconDownload } from "@tabler/icons-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { normalizeText } from "@/common/utils";
import type { RequestTemplateData } from "@/components/shared/pdfs/templates/requests/types";
import RequestTemplate from "../shared/pdfs/templates/RequestTemplate";

interface RequestPDFDropdownProps {
  requestId: string;
  createdDate: string;
  buttonText?: string;
  variant?: "contained" | "outlined" | "text";
  color?: "primary" | "secondary" | "inherit";
  fullWidth?: boolean;
}

const RequestPDFDropdown: React.FC<RequestPDFDropdownProps> = ({
  requestId,
  createdDate,
  buttonText = "Generar PDF",
  variant = "outlined",
  color = "secondary",
  fullWidth = false,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [requestData, setRequestData] = useState<RequestTemplateData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const open = Boolean(anchorEl);

  const fetchPDFData = useCallback(async () => {
    if (requestData || isLoading) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/employee-requests/${requestId}/pdf?isPDF=true&requestDate=${createdDate}`);
      const result = await response.json();
      console.log(result);
      if (result.success && result.responseObject) {
        setRequestData(result.responseObject);
      }
    } catch (error) {
      console.error("Error cargando datos del PDF:", error);
    } finally {
      setIsLoading(false);
    }
  }, [requestId, createdDate, requestData, isLoading]);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
      if (!requestData && !isLoading) {
        fetchPDFData();
      }
    },
    [requestData, isLoading, fetchPDFData],
  );

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const generateFileName = useCallback(
    (typeRequest: string, type: "director" | "employee") => {
      const normalizedRequest = normalizeText(typeRequest);

      if (!requestData?.employee) return `${normalizedRequest}_${type}`;
      const employeeName = `${requestData.employee.name}_${requestData.employee.paternal_last_name}`;
      const date = new Date().toISOString().split("T")[0];
      return `${normalizedRequest}_${type}_${employeeName}_${date}`;
    },
    [requestData],
  );

  return (
    <>
      <Button
        variant={variant}
        color={color}
        fullWidth={fullWidth}
        endIcon={<IconChevronDown size="16" />}
        onClick={handleClick}
        disabled={isLoading}
        aria-controls={open ? "pdf-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        {isLoading ? "Cargando..." : buttonText}
      </Button>

      <Menu
        id="pdf-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "pdf-button",
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {!requestData && isLoading ? (
          <MenuItem disabled>
            <ListItemIcon>
              <IconDownload size={20} />
            </ListItemIcon>
            <ListItemText primary="Cargando datos..." secondary="Obteniendo información del documento" />
          </MenuItem>
        ) : requestData ? (
          [
            <PDFDownloadLink
              key="director-pdf"
              document={<RequestTemplate data={requestData} type="director" />}
              fileName={`${generateFileName(requestData.request.display_name, "director")}.pdf`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {({ loading }) => (
                <MenuItem onClick={handleClose} disabled={loading}>
                  <ListItemIcon>
                    <IconUserCog size={20} />
                  </ListItemIcon>
                  <ListItemText
                    primary={loading ? "Generando PDF..." : "Para Director"}
                    secondary="Documento dirigido al director"
                  />
                  <IconDownload size={16} style={{ marginLeft: 8 }} />
                </MenuItem>
              )}
            </PDFDownloadLink>,

            <PDFDownloadLink
              key="employee-pdf"
              document={<RequestTemplate data={requestData} type="employee" />}
              fileName={`${generateFileName(requestData.request.display_name, "employee")}.pdf`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {({ loading }) => (
                <MenuItem onClick={handleClose} disabled={loading}>
                  <ListItemIcon>
                    <IconUser size={20} />
                  </ListItemIcon>
                  <ListItemText
                    primary={loading ? "Generando PDF..." : "Para Empleado"}
                    secondary="Documento dirigido al empleado"
                  />
                  <IconDownload size={16} style={{ marginLeft: 8 }} />
                </MenuItem>
              )}
            </PDFDownloadLink>,
          ]
        ) : (
          <MenuItem disabled>
            <ListItemIcon>
              <IconDownload size={20} />
            </ListItemIcon>
            <ListItemText primary="Datos no disponibles" secondary="No se encontraron los datos requeridos" />
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default RequestPDFDropdown;
