import React from "react";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import IncidentCreateForm from "./form/page";

const BCrumb = [
  {
    to: "/admin/employees-incidents",
    title: "Incidencias de empleados",
  },
  {
    title: "Crear nueva incidencia",
  },
];

const CreateIncident = () => {
  return (
    <PageContainer title="Crear nueva incidencia">
      <Breadcrumb title="Crear nueva incidencia" items={BCrumb} />
      <IncidentCreateForm />
    </PageContainer>
  );
};

export default CreateIncident;
