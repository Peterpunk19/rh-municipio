"use client";
import React from "react";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import BulkCreateIncidentsForm from "./form/BulkCreateIncidentsForm";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Card, CardContent, Alert, Typography } from "@mui/material";
import { ROLES } from "@/common/constants/Roles";
import { ExtendedUser } from "@/next-auth";

const BCrumb = [
  {
    to: "/admin/employees-incidents",
    title: "Incidencias de empleados",
  },
  {
    to: "/admin/employees-incidents/bulk-create",
    title: "Creación masiva de incidencias",
  },
];

export default function BulkCreatePage() {
  const { user } = useCurrentUser();

  const userRole = (user as ExtendedUser)?.role_name;
  const hasPermission = userRole === ROLES.ADMIN || userRole === ROLES.SOPORTE;

  if (!hasPermission) {
    return (
      <PageContainer title="Creación masiva de incidencias">
        <Breadcrumb title="Creación masiva de incidencias" items={BCrumb} />
        <Card>
          <CardContent>
            <Alert severity="error" sx={{ mb: 2 }}>
              No tienes permisos para crear incidencias masivas
            </Alert>
            <Typography variant="body2" color="text.secondary">
              Esta función está disponible únicamente para usuarios con rol ADMIN o SOPORTE.
            </Typography>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Creación masiva de incidencias">
      <Breadcrumb title="Creación masiva de incidencias" items={BCrumb} />
      <BulkCreateIncidentsForm />
    </PageContainer>
  );
}
