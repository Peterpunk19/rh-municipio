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
import PDFGenerator from "@/components/shared/pdfs/PDFGenerator";
import MedicalValidity from "@/components/shared/pdfs/templates/employees/MedicalValidity";
import { normalizeText } from "@/common/utils";

const EmployeeProfileCard = ({ employeeData }: EmployeePageProps) => {
  const defaultImageMale: string = "/images/profile/user-1.jpg";
  const defaultImageFemale: string = "/images/profile/user-10.jpg";
  const redirectToEdit = "/admin/employees/edit/";
  const fullName = `${employeeData.name} ${employeeData.paternal_last_name} ${employeeData.maternal_last_name}` || "";
  const category = employeeData?.employee_hiring[0]?.category?.display_name || "";
  const secretary = employeeData?.employee_ascriptions[0].direccion?.secretaria?.display_name || "";
  const direction = employeeData?.employee_ascriptions[0].direccion?.display_name || "";
  const [openVigencia, setOpenVigencia] = React.useState(false);
  const fileName = `${normalizeText(fullName)}_${formatDate(new Date(), "dd_MM_yyyy")}`;

  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="space-between" p={3} width="100%">
        {/* Avatar + Info (lado izquierdo) */}
        <Box display="flex" alignItems="center">
          <Avatar
            alt={fullName}
            src={employeeData.gender_id === 1 ? defaultImageFemale : defaultImageMale}
            sx={{ width: 84, height: 84 }}
          />
          <Box sx={{ display: "flex", marginLeft: "15px", flexDirection: "column" }}>
            <Typography variant="body1" fontWeight={600}>
              {fullName}
            </Typography>
            <Typography variant="body2">{category}</Typography>
            <Typography variant="body2">{direction}</Typography>
            <Typography variant="body2">{secretary}</Typography>
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
              onClick={() => redirect(`${redirectToEdit}${employeeData.id}?name=${fullName}`)}
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
          <Typography>
            <strong>Nombre:</strong> {fullName}
          </Typography>
          <Typography>
            <strong>CURP:</strong> {employeeData.curp || ""}
          </Typography>
          <Typography>
            <strong>Fecha de nacimiento:</strong> {formatDate(employeeData.birthday) || ""}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">Datos del trabajo</Typography>
          <Typography>
            <strong>Ascripción:</strong> {secretary} / {direction}
          </Typography>
          <Typography>
            <strong>Categoría:</strong> {category}
          </Typography>
          <Typography>
            <strong>Tipo de contrato:</strong> {employeeData?.employee_hiring[0]?.employee_type?.display_name || ""}
          </Typography>
          <Divider sx={{ my: 2 }} />

          <Typography variant="h6">Vigencia de Derechos</Typography>
          <Typography>
            <strong>Estado:</strong> <b style={{ color: "green" }}>{employeeData?.vigencia?.estado ?? "No disponible"}</b>
          </Typography>
          <Typography>
            <strong>Inicio:</strong> {formatDate(employeeData?.employee_hiring[0]?.start_job_date) || ""}
          </Typography>
          <Typography>
            <strong>Fin:</strong> {formatDate(employeeData?.employee_hiring[0]?.end_job_date) || ""}
          </Typography>
          <Divider sx={{ my: 2 }} />
        </DialogContent>
        <DialogActions>
          <PDFGenerator
            data={employeeData}
            fileName={fileName}
            title="Vigencia Médica"
            template={MedicalValidity}
            optionsConfig={{
              displayMode: "button",
            }}
            buttonLabel="Imprimir"
            buttonProps={{ color: "primary" }}
          />
          <Button color="error" onClick={() => setOpenVigencia(false)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EmployeeProfileCard;
