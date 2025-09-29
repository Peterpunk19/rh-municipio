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

  const updateDirector = async () => {
    try {
      const response = await getAdministrativesOrganizations();
      if (response.statusCode === StatusCodes.OK && response.responseObject?.administrativeOrganizations) {
        setSecretarias(response.responseObject.administrativeOrganizations);
      } else {
        setSecretarias([]);
      }
    } catch (error: any) {
      logger.error({ error: error.message, stack: error.stack });
      setSecretarias([]);
    }
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
              onUpdateDirector={updateDirector}
            />
          </AccordionDetails>
        </Accordion>
      ))}
    </PageContainer>
  );
}
