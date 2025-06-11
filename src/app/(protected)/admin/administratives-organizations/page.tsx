"use client";

import { Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useState, useEffect } from "react";
import DireccionesList from "./(items)/DireccionesList";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import { getAdministrativesOrganizations } from "@/services/administratives-organizations";
import { IAdministrativeOrganization } from "@/interfaces/AdministrativeOrganization";
import Loading from "@/app/(protected)/admin/loading";
import { StatusCodes } from "http-status-codes";
import { logger } from "@/lib/logger";
import PageContainer from "@/app/components/container/PageContainer";

const BCrumb = [
  {
    to: "/admin/administratives-organizations",
    title: "Organizaciones Administrativas",
  },
];

export default function AdministrativesOrganizations() {
  const [secretarias, setSecretarias] = useState<IAdministrativeOrganization[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | false>(false);

  const updateDirector = (secretariaId: number, direccionId: number, data: any) => {
    if (!secretarias) return;

    const secretaria = secretarias.find((sec) => sec.id === secretariaId);
    if (!secretaria || !secretaria.direcciones) {
      logger.error("No se encontró la secretaría con ID:", secretariaId);
      return;
    }

    const direccion = secretaria.direcciones.find((dir) => dir.id === direccionId);
    if (!direccion) {
      logger.error("No se encontró la dirección con ID:", direccionId);
      return;
    }

    const updatedSecretarias = secretarias.map((sec) => {
      if (sec.id === secretariaId) {
        const updatedDirecciones = (sec.direcciones || []).map((dir) => {
          if (dir.id === direccionId) {
            const directorData = data.director;
            const deputyDirectorData = data.deputyDirector;

            const updatedDir = {
              ...dir,
              director: {
                ...dir.director,
                name: directorData.employee
                  ? `${directorData.employee.name} ${directorData.employee.paternal_last_name} ${directorData.employee.maternal_last_name}`
                  : dir.director?.name || "Director",
                id: directorData.employee_id || dir.director?.id,
                startDate: directorData.start_date || dir.director?.startDate,
                endDate: directorData.end_date || dir.director?.endDate,
              },
              ...(deputyDirectorData && {
                deputy_director: {
                  ...dir.deputy_director,
                  name: deputyDirectorData.employee
                    ? `${deputyDirectorData.employee.name} ${deputyDirectorData.employee.paternal_last_name} ${deputyDirectorData.employee.maternal_last_name}`
                    : dir.deputy_director?.name || "Suplente",
                  id: deputyDirectorData.employee_id || dir.deputy_director?.id,
                },
              }),
            };
            return updatedDir;
          }
          return dir;
        });
        return { ...sec, direcciones: updatedDirecciones };
      }
      return sec;
    });

    setSecretarias(updatedSecretarias);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getAdministrativesOrganizations();
        if (data.statusCode === StatusCodes.OK && data.responseObject?.administrativeOrganizations) {
          setSecretarias(data.responseObject.administrativeOrganizations);
        } else {
          setSecretarias([]);
        }
      } catch (error: any) {
        logger.error({ error: error.message, stack: error.stack });
        setSecretarias([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!secretarias?.length && !loading) {
    return <div>Organizaciones administrativas no encontradas</div>;
  }
  return (
    <PageContainer title="Administrador de secretarías" description="Administrador de secretarías">
      <Breadcrumb title="Administrador de secretarías" items={BCrumb} />

      {secretarias?.map((secretaria) => (
        <Accordion
          key={secretaria.id}
          expanded={expanded === `panel-${secretaria.id}`}
          onChange={(event, isExpanded) => setExpanded(isExpanded ? `panel-${secretaria.id}` : false)}
        >
          <AccordionSummary
            expandIcon={expanded === `panel-${secretaria.id}` ? <VisibilityIcon /> : <VisibilityOffIcon />}
          >
            <Typography>{secretaria.display_name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <DireccionesList
              secretaria={secretaria.display_name}
              direcciones={secretaria.direcciones || []}
              onUpdateDirector={(direccionId, data) => updateDirector(secretaria.id, direccionId, data)}
            />
          </AccordionDetails>
        </Accordion>
      ))}
    </PageContainer>
  );
}
