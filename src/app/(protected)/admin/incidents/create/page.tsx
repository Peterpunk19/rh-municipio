import React from "react";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import IncidentCreateForm from "./form/page";
const CreateIncident = () => {
  return (
    <PageContainer title="Crear nueva incidencia">
      <Breadcrumb title="Crear nueva incidencia" />
      <IncidentCreateForm></IncidentCreateForm>
    </PageContainer>
  );
};

export default CreateIncident;
