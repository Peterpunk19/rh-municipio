import { Card, CardContent, Typography, Button, Stack } from "@mui/material";
import { useState } from "react";
import DirectorFormDialog from "./DirectorFormDialog";
import { IDireccion } from "@/interfaces/AdministrativeOrganization";
import { EditIcon } from "lucide-react";

export default function DireccionesList({
  direcciones,
  onUpdateDirector,
}: { direcciones: IDireccion[]; onUpdateDirector: (id: number, data: any) => void }) {
  const [selected, setSelected] = useState<IDireccion | null>(null);

  return (
    <>
      <Stack spacing={2}>
        {direcciones.length === 0 ? <Typography>No hay direcciones</Typography> : null}
        {direcciones.map((direccion) => (
          <Card key={direccion.id}>
            <CardContent>
              <Typography variant="h6">{direccion.name}</Typography>
              <Typography variant="body1">Director: {direccion.director.name || "No asignado"}</Typography>
              <Typography variant="body1">Suplente: {direccion.deputy_director.name || "N/A"}</Typography>
              <Typography variant="body1">
                Periodo: {direccion.startDate || "N/A"} - {direccion.endDate || "N/A"}
              </Typography>
              <Button onClick={() => setSelected(direccion)} size="small" startIcon={<EditIcon />}>
                Editar Director
              </Button>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <DirectorFormDialog
        open={!!selected}
        director={selected?.director}
        onClose={() => setSelected(null)}
        onSave={(data) => {
          onUpdateDirector(selected?.id || 0, data);
          setSelected(null);
        }}
      />
    </>
  );
}
