import React from "react";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import CreateRequestForm from "./form-requests/CreateRequestForm";

const BCrumb = [
  {
    to: "/admin/employees-requets",
    title: "Listado de solicitudes de empleados",
  },
  {
    title: "Crear solicitud",
  },
];

const CreateEmployee = () => {
  return (
    <PageContainer title="Crear solicitud">
      <Breadcrumb title="Crear solicitud" items={BCrumb} />
      <CreateRequestForm />
    </PageContainer>
  );
};

export default CreateEmployee;
