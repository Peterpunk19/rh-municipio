"use client";

import React from "react";
import { Box, Container } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import { HelpCenterLayout } from "../HelpCenterLayout";
import helpCategories from "../../data";

const ArticleDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const articleId = params.id as string;

  const handleArticleSelect = (newArticleId: string) => {
    router.push(`/help-center/admin/articles/${newArticleId}`);
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
              selectedArticleId={articleId}
              onArticleSelect={handleArticleSelect}
              enableRouting={true}
            />
          </Container>
        </Box>
      </PageContainer>
    </Box>
  );
};

export default ArticleDetailPage;
