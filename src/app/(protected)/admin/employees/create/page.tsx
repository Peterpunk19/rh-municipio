import React from "react";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";

import FormWizardSteps from "@/app/(protected)/admin/employees/create/form-employees/FormWizardSteps";

const CreateEmployee = () => {
  return (
    <PageContainer title="Crear nuevo empleado">
      <Breadcrumb title="Crear nuevo empleado" />
      <FormWizardSteps />
    </PageContainer>
  );
};

export default CreateEmployee;
