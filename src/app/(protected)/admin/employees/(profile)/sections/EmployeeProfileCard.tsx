"use client";

import * as React from "react";
import { redirect } from "next/navigation";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { IconAmbulance, IconEdit, IconUserScan } from "@tabler/icons-react";
import Stack from "@mui/material/Stack";
import { Chip, Dialog, DialogTitle, DialogContent, DialogActions, Button, Divider } from "@mui/material";
import { formatDate } from "@/utils/formatter";

const EmployeeProfileCard = ({ employeeData }: EmployeePageProps) => {
  const DEFAULT_IMAGE_MALE: string = "/images/profile/user-1.jpg";
  const DEFAULT_IMAGE_FEMALE: string = "/images/profile/user-10.jpg";
  const REDIRECT_TO_EDIT = "/admin/employees/edit/";
  const FULL_NAME = `${employeeData.name} ${employeeData.paternal_last_name} ${employeeData.maternal_last_name}`;

  const [openVigencia, setOpenVigencia] = React.useState(false);

  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="space-between" p={3} width="100%">
        {/* Avatar + Info (lado izquierdo) */}
        <Box display="flex" alignItems="center">
          <Avatar
            alt={FULL_NAME}
            src={employeeData.gender_id === 1 ? DEFAULT_IMAGE_FEMALE : DEFAULT_IMAGE_MALE}
            sx={{ width: 84, height: 84 }}
          />
          <Box sx={{ display: "flex", marginLeft: "15px", flexDirection: "column" }}>
            <Typography variant="body1" fontWeight={600}>
              {FULL_NAME}
            </Typography>
            <Typography variant="body2">{employeeData?.employee_ascriptions[0]?.category?.display_name}</Typography>
            <Typography variant="body2">{employeeData?.employee_ascriptions[0]?.direccion?.display_name}</Typography>
            <Typography variant="body2">
              {employeeData?.employee_ascriptions[0]?.direccion?.secretaria?.display_name}
            </Typography>
          </Box>
        </Box>

        {/* Acciones (lado derecho) */}
        <Box>
          <Chip size="medium" color="primary" label={`Numero de empleado: ${employeeData?.number_employee}`} />
          <Stack direction="row" spacing={1} mt={1}>
            <IconButton aria-label="vigencia" onClick={() => setOpenVigencia(true)}>
              <IconAmbulance stroke={1.5} />
            </IconButton>
            <IconButton
              aria-label="edit"
              onClick={() => redirect(`${REDIRECT_TO_EDIT}${employeeData.id}?name=${FULL_NAME}`)}
            >
              <IconEdit stroke={1.5} />
            </IconButton>
            <IconButton aria-label="scan">
              <IconUserScan stroke={1.5} />
            </IconButton>
          </Stack>
        </Box>
      </Box>

      {/* Modal de Vigencia Médica */}
      <Dialog open={openVigencia} onClose={() => setOpenVigencia(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Vigencia Médica</DialogTitle>
        <DialogContent dividers>
          <Typography variant="h6">Datos del Asegurado</Typography>
          <Typography>Nombre: {FULL_NAME}</Typography>
          <Typography>CURP: {employeeData.curp}</Typography>
          <Typography>Fecha de nacimiento: {formatDate(employeeData.birthday)}</Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">Datos del trabajo</Typography>
          <Typography>Ascripcion: OFICIALIA/DIRECCION DE RECURSOS HUMANOS</Typography>
          <Typography>Categoria: TECNICO ESPECIALIZADO E</Typography>
          <Typography>Tipo de contrato: CONFIANZA</Typography>
          <Divider sx={{ my: 2 }} />

          <Typography variant="h6">Vigencia de Derechos</Typography>
          <Typography>
            Estado: <b style={{ color: "green" }}>{employeeData?.vigencia?.estado ?? "No disponible"}</b>
          </Typography>
          <Typography>Inicio: Si es de contrato poner fecha de alta</Typography>
          <Typography>Fin: Si es de contrato poner fecha de baja</Typography>
          <Divider sx={{ my: 2 }} />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary">
            Imprimir
          </Button>
          <Button color="error" onClick={() => setOpenVigencia(false)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EmployeeProfileCard;
