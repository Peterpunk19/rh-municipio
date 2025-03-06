"use client";
import * as React from "react";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import { useParams, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import PageContainer from "@/app/components/container/PageContainer";
import FormWizardSteps from "@/app/(protected)/admin/employees/create/form-employees/FormWizardSteps";
import { updateValues } from "@/store/employees/EmployeeSlice";
import { flattenObject } from "@/common/utils";
import { getEmployeeById } from "@/services/employees";
import { redirect } from "next/navigation";
import { logger } from "@/lib/logger";

const EditEmployee = () => {
  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const employeeName = searchParams.get("name");
  React.useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        if (id) {
          const response = await getEmployeeById(id as string);
          if (response.success) {
            const employeeData = response.responseObject;
            const employeeDataFlatted = flattenObject(employeeData);
            dispatch(updateValues({ ...employeeDataFlatted }));
          } else if (response.statusCode === 404) {
            logger.error({ error: "User not found" });
            redirect("/admin/employees");
          } else {
            logger.error({ error: `An error occurred with status code: ${response.statusCode}` });
            redirect("/admin/employees");
          }
          setLoading(false);
        } else {
          console.error("No employee ID provided");
          setLoading(false);
          redirect("/admin/employees");
        }
      } catch (error: any) {
        logger.error({ error: error.message, stack: error.stack });
        setLoading(false);
        redirect("/admin/employees");
      }
    };
    fetchData();
  }, [id]);

  const BCrumb = [
    {
      to: "/admin/employees",
      title: "Empleados",
    },
    {
      title: employeeName ? employeeName : "Empleado",
      to: `/admin/employees/${id}`,
    },
    {
      title: "Editar empleado",
      active: true,
    },
  ];
  if (loading) return <div>Cargando...</div>;

  return (
    !loading && (
      <PageContainer title="Editar empleado">
        <Breadcrumb title="Editar empleado" items={BCrumb} />
        <FormWizardSteps isEdit={true} />
      </PageContainer>
    )
  );
};
export default EditEmployee;
