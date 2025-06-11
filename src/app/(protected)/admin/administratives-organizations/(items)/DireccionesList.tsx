import { Card, CardContent, Typography, Button, Stack, Chip } from "@mui/material";
import { useState } from "react";
import DirectorFormDialog from "./DirectorFormDialog";
import { IDireccion } from "@/interfaces/AdministrativeOrganization";
import { EditIcon } from "lucide-react";
import { formatDate } from "@/utils/formatter";

export default function DireccionesList({
  secretaria,
  direcciones,
  onUpdateDirector,
}: { secretaria: string; direcciones: IDireccion[]; onUpdateDirector: (id: number, data: any) => void }) {
  const [selected, setSelected] = useState<IDireccion | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = (direccion: IDireccion) => {
    setSelected(direccion);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSaveDirector = (data: any) => { 
    if (selected) {
      onUpdateDirector(selected.id, data);
    }
    setIsDialogOpen(false);
  };

  return (
    <>
      <Stack spacing={2}>
        {direcciones.length === 0 ? <Typography>No hay direcciones</Typography> : null}
        {direcciones.map((direccion) => (
          <Card key={direccion.id}>
            <CardContent>
              <Typography variant="h6">{direccion.name}</Typography>

              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1, mb: 0.5 }}>
                <Typography variant="body2" fontWeight="bold">
                  Director:
                </Typography>
                <Typography variant="body2">{direccion.director?.name || "No asignado"}</Typography>
                {direccion.director?.name && <Chip size="small" label="Activo" color="primary" variant="outlined" />}
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                <Typography variant="body2" fontWeight="bold">
                  Suplente:
                </Typography>
                <Typography variant="body2">{direccion.deputy_director?.name || "No asignado"}</Typography>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                <Typography variant="body2" fontWeight="bold">
                  Periodo:
                </Typography>
                <Typography variant="body2">
                  {direccion.director && direccion.director.startDate
                    ? formatDate(direccion.director.startDate)
                    : "N/A"}{" "}
                  -
                  {direccion.director && direccion.director.endDate ? formatDate(direccion.director.endDate) : "Actual"}
                </Typography>
              </Stack>

              <Button
                onClick={() => handleOpenDialog(direccion)}
                size="small"
                startIcon={<EditIcon />}
                variant="outlined"
              >
                Editar Director
              </Button>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <DirectorFormDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveDirector}
        secretaria={secretaria}
        direccion={selected || null}
      />
    </>
  );
}
