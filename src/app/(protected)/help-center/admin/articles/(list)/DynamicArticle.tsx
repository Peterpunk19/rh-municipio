"use client";

import React from "react";
import ArticleRenderer from "./ArticleRenderer";

interface ArticleData {
  title: string;
  introduction: string;
  sections: any[];
}

interface DynamicArticleProps {
  articleId: string;
}

const DynamicArticle = ({ articleId }: DynamicArticleProps) => {
  const [articleData, setArticleData] = React.useState<ArticleData | null>(null);

  React.useEffect(() => {
    let isMounted = true;

    const loadArticle = async () => {
      try {
        // Cambia esta ruta según donde tengas tus JSON
        const url = `/help-center/articles/${articleId}.json`;
        console.log("Fetching from:", url);

        const response = await fetch(url);

        const data = await response.json();

        if (isMounted) {
          setArticleData(data);
        }
      } catch (error) {
        console.error("Error loading article:", error);
        if (isMounted) {
          setArticleData({
            title: `Artículo ${articleId}`,
            introduction: "Contenido no disponible",
            sections: [],
          });
        }
      }
    };

    loadArticle();

    return () => {
      isMounted = false;
    };
  }, [articleId]);

  if (!articleData) return <div>Cargando...</div>;

  return <ArticleRenderer {...articleData} />;
};

export default DynamicArticle;
