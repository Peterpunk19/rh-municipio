import React from "react";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";

import FormWizardSteps from "@/app/(protected)/admin/employees/create/form-employees/FormWizardSteps";

const BCrumb = [
  {
    to: "/admin/employees",
    title: "Empleados",
  },
  {
    title: "Crear Empleado",
  },
];

const CreateEmployee = () => {
  return (
    <PageContainer title="Crear nuevo empleado">
      <Breadcrumb title="Crear nuevo empleado" items={BCrumb}/>
      <FormWizardSteps />
    </PageContainer>
  );
};

export default CreateEmployee;
