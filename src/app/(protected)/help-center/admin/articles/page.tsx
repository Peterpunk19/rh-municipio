"use client";

import React, { useState } from "react";
import { Box, Container } from "@mui/material";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import { HelpCenterLayout } from "./HelpCenterLayout";
import helpCategories from "../data";

const ArticlesPage = () => {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  const handleArticleSelect = (articleId: string) => {
    setSelectedArticleId(articleId);
  };

  return (
    <Box>
      <PageContainer title="Centro de ayuda" description="this is Help Center page">
        <Container maxWidth="xl">
          <Breadcrumb title="Centro de ayuda" />
        </Container>
        <Box display="flex" flexDirection="column" height="100vh">
          <Container maxWidth="xl">
            <HelpCenterLayout
              helpCategories={helpCategories}
              selectedArticleId={selectedArticleId}
              onArticleSelect={handleArticleSelect}
              enableRouting={false}
            />
          </Container>
        </Box>
      </PageContainer>
    </Box>
  );
};

export default ArticlesPage;
