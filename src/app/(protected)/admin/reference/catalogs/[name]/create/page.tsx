"use client";
import { use, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { Box, Button, Grid2, Alert, Switch, MenuItem, FormControl, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import CustomFormLabel from "@/components/theme-elements/CustomFormLabel";
import CustomTextField from "@/components/theme-elements/CustomTextField";
import CustomSelect from "@/components/theme-elements/CustomSelect";
import { catalogs } from "@/app/(protected)/admin/reference/catalogs/_config";
import { getCatalogFormConfig } from "@/app/(protected)/admin/reference/catalogs/[name]/create/formConfig";
import { useSelector } from "@/store/hooks";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { fetchCatalog } from "@/store/reference/catalogs/CatalogsSlice";
import { useEffect } from "react";
import ParentCard from "@/app/components/shared/ParentCard";
import Link from "next/link";
import { normalizeText, calculateDaysBetweenDates } from "@/common/utils";

export default function CreateCatalog({ params }: { params: Promise<{ name: string }> }) {
  const { name } = use(params);
  const catalogConfig = catalogs[name];
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  if (!catalogConfig) {
    notFound();
  }

  const formConfig = getCatalogFormConfig(name);
  const [formData, setFormData] = useState<Record<string, any>>({
    active: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const secretarias = useSelector((state) => state.catalogsList.data);

  useEffect(() => {
    if (name === "direccion") {
      dispatch(fetchCatalog("secretarias", ""));
    }
  }, [dispatch, name]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    formConfig.fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} es requerido`;
      }
    });

    const dateFields = formConfig.fields.filter((field) => field.type === "date");
    if (dateFields.length >= 2) {
      const dates = dateFields
        .map((field) => ({
          name: field.name,
          label: field.label,
          value: formData[field.name] || null,
        }))
        .filter((d) => d.value !== null);

      if (dates.length >= 2) {
        for (let i = 0; i < dates.length - 1; i++) {
          for (let j = i + 1; j < dates.length; j++) {
            const diffInDays = calculateDaysBetweenDates(dates[i].value!, dates[j].value!);

            if (diffInDays > 10) {
              newErrors[dates[j].name] = `La diferencia entre ${dates[i].label} y ${dates[j].label} no puede ser mayor a 10 días`;
              break;
            }
          }
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    if (!validateForm()) {
      return;
    }

    setOpenConfirmDialog(true);
  };

  const handleConfirmSave = async () => {
    setOpenConfirmDialog(false);
    setLoading(true);

    try {
      const dataSubmit = {
        ...formData,
        name: normalizeText(formData.display_name || ""),
        display_name: formData.display_name.toUpperCase(),
      };

      const response = await fetch(`/api/catalogs/${catalogConfig.fetch}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataSubmit),
      });

      const result = await response.json();

      if (!response.ok) {
        let errorMessage = result.message || "Error al crear el registro";
        
        if (result.responseObject?.error) {
          errorMessage += `: ${result.responseObject.error}`;
        } else if (result.responseObject && typeof result.responseObject === 'object') {
          const validationErrors: string[] = [];
          Object.keys(result.responseObject).forEach((field) => {
            if (result.responseObject[field]?.messages) {
              validationErrors.push(...result.responseObject[field].messages);
            }
          });
          if (validationErrors.length > 0) {
            errorMessage = validationErrors.join(', ');
          }
        }
        
        setSubmitError(errorMessage);
        setLoading(false);
        return;
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        router.push(`/admin/reference/catalogs/${name}`);
      }, 1500);
    } catch (error: any) {
      setSubmitError(error.message || "Error al crear el registro");
      setLoading(false);
    }
  };

  const BCrumb = [
    { to: "/admin/reference/catalogs", title: "Catálogos" },
    { to: `/admin/reference/catalogs/${name}`, title: catalogConfig.title },
    { title: catalogConfig.textCreate },
  ];

  return (
    <PageContainer title={catalogConfig.textCreate} description={catalogConfig.textCreate}>
      <Breadcrumb title={catalogConfig.textCreate} items={BCrumb} />
      <ParentCard title="Rellena los datos">
        <Box component="form" onSubmit={handleSubmit}>
          <Grid2 container spacing={3}>
            {formConfig.fields.map((field) => (
              <Grid2 size={{ xs: 12, md: field.gridSize || 6 }} key={field.name}>
                <FormControl fullWidth>
                  <CustomFormLabel htmlFor={field.name}>
                    {field.label}
                    {field.required && " *"}
                  </CustomFormLabel>

                  {field.type === "text" && (
                    <CustomTextField
                      id={field.name}
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(field.name, e.target.value)}
                      fullWidth
                      error={!!errors[field.name]}
                      helperText={errors[field.name]}
                      placeholder={field.placeholder}
                    />
                  )}

                  {field.type === "date" && (
                    <CustomTextField
                      id={field.name}
                      name={field.name}
                      type="date"
                      value={formData[field.name] || ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(field.name, e.target.value)}
                      fullWidth
                      error={!!errors[field.name]}
                      helperText={errors[field.name]}
                      InputLabelProps={{ shrink: true }}
                    />
                  )}

                  {field.type === "select" && (
                    <CustomSelect
                      id={field.name}
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange(field.name, e.target.value)}
                      fullWidth
                      error={!!errors[field.name]}
                    >
                      <MenuItem key="default" value="0">
                        Selecciona una {field.label}
                      </MenuItem>
                      {field.name === "secretaria_id" &&
                        secretarias.map((sec: any) => (
                          <MenuItem key={sec.id} value={sec.id}>
                            {sec.display_name}
                          </MenuItem>
                        ))}
                    </CustomSelect>
                  )}

                  {field.type === "switch" && (
                    <Switch
                      id={field.name}
                      name={field.name}
                      checked={formData[field.name] ?? true}
                      onChange={(e) => handleChange(field.name, e.target.checked)}
                    />
                  )}
                </FormControl>
              </Grid2>
            ))}
            <Grid2 size={{ xs: 12 }}>
              {submitError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {submitError}
                </Alert>
              )}
              {submitSuccess && !submitError && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Registro creado exitosamente. Redirigiendo...
                </Alert>
              )}
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Link href={`/admin/reference/catalogs/${name}`} passHref>
                  <Button variant="contained" color="error" disabled={loading}>
                    Cancelar
                  </Button>
                </Link>
                <Button type="submit" variant="contained" color="primary" disabled={loading}>
                  {loading ? "Guardando..." : "Guardar"}
                </Button>
              </Box>
            </Grid2>
          </Grid2>
        </Box>
      </ParentCard>

      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">
          Confirmar creación
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            ¿Estás seguro de que deseas crear este registro? Verifica que todos los datos sean correctos.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)} color="error" variant="outlined">
            Cancelar
          </Button>
          <Button onClick={handleConfirmSave} color="primary" variant="contained" autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
}
