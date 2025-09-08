"use client";

import React, { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Typography, Grid, Card, ListItem, ListItemText, List, Divider, Collapse, IconButton } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import DynamicArticle from "@/app/(protected)/help-center/admin/articles/(list)/DynamicArticle";
import { generateUniqueKey } from "@/utils";
import Button from "@mui/material/Button";

// Define interfaces
interface ArticleChild {
  displayName: string;
  url: string;
}

interface BaseArticle {
  displayName: string;
  url: string;
}

interface SimpleArticle extends BaseArticle {
  children?: undefined;
}

interface NestedArticle extends BaseArticle {
  children: ArticleChild[];
}

type Article = SimpleArticle | NestedArticle;

interface Category {
  id: number;
  displayName: string;
  articles: Article[];
}

interface HelpCenterLayoutProps {
  helpCategories: Category[];
  selectedArticleId?: string;
  onArticleSelect?: (articleId: string) => void;
  enableRouting?: boolean;
}

export const HelpCenterLayout = ({
  helpCategories,
  selectedArticleId,
  onArticleSelect,
  enableRouting = false,
}: HelpCenterLayoutProps) => {
  const [expandedArticles, setExpandedArticles] = useState<Record<string, boolean>>({});
  const router = useRouter();

  const handleToggleExpand = (articleUrl: string) => {
    setExpandedArticles((prev) => ({
      ...prev,
      [articleUrl]: !prev[articleUrl],
    }));
  };

  const isArticleActive = (articleUrl: string) => {
    return selectedArticleId === articleUrl;
  };

  const hasChildren = (article: Article): article is NestedArticle => {
    return !!(article as NestedArticle).children;
  };

  const handleArticleClick = (article: Article, articleUrl: string) => {
    const articleHasChildren = hasChildren(article);

    if (articleHasChildren) {
      handleToggleExpand(articleUrl);
      return;
    }

    if (enableRouting) {
      router.push(`/help-center/admin/articles/${articleUrl}`);
    } else if (onArticleSelect) {
      onArticleSelect(articleUrl);
    }
  };

  const renderArticleItem = (article: Article, depth = 0): JSX.Element => {
    const articleHasChildren = hasChildren(article);
    const isActive = isArticleActive(article.url);
    const isExpanded = expandedArticles[article.url];

    return (
      <React.Fragment key={generateUniqueKey()}>
        <ListItem
          sx={{
            pl: 4 + depth * 2,
            pt: 0,
            pb: 0,
            cursor: "pointer",
            backgroundColor: isActive ? (theme: any) => theme.palette.action.selected : "inherit",
            "&:hover": {
              backgroundColor: (theme: any) => theme.palette.action.hover,
            },
          }}
          onClick={() => handleArticleClick(article, article.url)}
        >
          <ListItemText
            primary={
              <Typography
                variant="body2"
                component="span"
                sx={{
                  color: (theme: any) => theme.palette.grey.A800,
                  fontWeight: isActive ? "bold" : "normal",
                }}
              >
                {article.displayName}
              </Typography>
            }
          />
          {articleHasChildren && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleExpand(article.url);
              }}
            >
              {isExpanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          )}
        </ListItem>

        {articleHasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {article.children.map((child: ArticleChild) =>
                renderArticleItem({ ...child, children: undefined }, depth + 1),
              )}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={3}>
        <Card sx={{ p: 3 }}>
          <List sx={{ width: "100%", bgcolor: "background.paper" }}>
            {helpCategories.map((category: Category) => (
              <React.Fragment key={category.id}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Button color="primary" variant="contained" fullWidth sx={{ justifyContent: "flex-start" }}>
                        {category.displayName}
                      </Button>
                    }
                  />
                </ListItem>
                <List component="div" disablePadding>
                  {category.articles.map((article: Article) => renderArticleItem(article))}
                </List>
                <Divider sx={{ pt: 2 }} />
              </React.Fragment>
            ))}
          </List>
        </Card>
      </Grid>
      <Grid item xs={9}>
        <Card sx={{ p: 3, minHeight: "80vh" }}>
          {selectedArticleId ? (
            <Suspense fallback={<div>Cargando artículo...</div>}>
              <DynamicArticle articleId={selectedArticleId} />
            </Suspense>
          ) : (
            <>
              <Typography variant="h6">Selecciona un artículo</Typography>
              <Typography variant="body2">Elige un tema del menú lateral para ver su contenido</Typography>
            </>
          )}
        </Card>
      </Grid>
    </Grid>
  );
};
