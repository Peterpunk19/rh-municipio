"use client";

import React from "react";
import { Box, Typography, Chip, List, ListItem, ListItemText, Paper } from "@mui/material";

import { generateUniqueKey } from "@/utils";
import Image from "next/image";

interface Step {
  text: string;
  description?: string;
  items?: string[];
  image?: {
    src: string;
    alt: string;
    caption?: string;
  };
  video?: {
    src: string;
    caption?: string;
  };
}

interface Section {
  type: string;
  content: any;
  text?: string;
}

interface ArticleRendererProps {
  title: string;
  introduction: string;
  sections: Section[];
}

const loginImage = "/images/help-center/login.png";
const incidentMenu = "/images/help-center/028-incident-menu.png";
const incidentList = "/images/help-center/028-incident-list.png";
const incidentFilters = "/images/help-center/028-incident-filters.png";
const incidentActions = "/images/help-center/028-incident-actions.png";
const incidentDetails = "/images/help-center/028-incident-details.png";
const incidentStatus = "/images/help-center/028-incident-status.png";
const incidentStatusUpdated = "/images/help-center/028-incident-status-updated.png";

const ArticleRenderer = ({ title, introduction, sections }: ArticleRendererProps) => {
  const imageMap: Record<string, any> = {
    "login.png": loginImage,
    "028-incident-menu.png": incidentMenu,
    "028-incident-list.png": incidentList,
    "028-incident-filters.png": incidentFilters,
    "028-incident-actions.png": incidentActions,
    "028-incident-details.png": incidentDetails,
    "028-incident-status.png": incidentStatus,
    "028-incident-status-updated.png": incidentStatusUpdated,
  };

  const videoMap: Record<string, any> = {
    "login.mp4": "/videos/login.mp4",
    "028.mp4": "/videos/028.mp4",
  };

  const getVideoPath = (videoSrc: string): string => {
    if (videoSrc.startsWith("http") || videoSrc.startsWith("/")) {
      return videoSrc;
    }

    return videoMap[videoSrc] || `/videos/${videoSrc}`;
  };

  return (
    <>
      <Typography variant="h2" gutterBottom>
        {title}
      </Typography>

      {introduction && (
        <Typography variant="body1" paragraph sx={{ mb: 4 }}>
          {introduction}
        </Typography>
      )}

      {sections &&
        sections.map((section) => {
          switch (section.type) {
            case "step-group":
              return (
                <Box key={`section-${generateUniqueKey()}`} sx={{ mb: 4 }}>
                  {section.content.title && (
                    <Typography variant="h3" gutterBottom>
                      {section.content.title}
                    </Typography>
                  )}

                  {section.content.steps.map((step: Step, stepIndex: number) => (
                    <Box key={`step-${generateUniqueKey()}`} sx={{ mb: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                        <Chip
                          label={stepIndex + 1}
                          color="primary"
                          size="small"
                          sx={{
                            mr: 1.5,
                            fontWeight: "bold",
                            fontSize: "0.875rem",
                            mt: 0.5,
                          }}
                        />
                        <Box>
                          <Typography variant="h5" component="div" pt={0.3}>
                            {step.text}
                          </Typography>

                          {step.description && (
                            <Typography variant="body1" paragraph sx={{ mt: 1 }}>
                              {step.description}
                            </Typography>
                          )}

                          {step.items && (
                            <List dense sx={{ pl: 2, listStyleType: "disc", listStylePosition: "inside" }}>
                              {step.items.map((item: string) => (
                                <ListItem
                                  key={`item-${generateUniqueKey()}`}
                                  sx={{
                                    display: "list-item",
                                    py: 0.25,
                                    pl: 1,
                                    color: "error.main",
                                    "& .MuiListItemText-root": {
                                      display: "inline-block",
                                      ml: 0.5,
                                    },
                                  }}
                                >
                                  <ListItemText primary={item} />
                                </ListItem>
                              ))}
                            </List>
                          )}
                        </Box>
                      </Box>

                      {step.image && imageMap[step.image.src] && (
                        <Box sx={{ my: 3, textAlign: "center" }}>
                          <Image
                            src={imageMap[step.image.src]}
                            alt={step.image.alt}
                            width={800}
                            height={450}
                            style={{
                              width: "100%",
                              height: "auto",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                            }}
                          />

                          {step.image.caption && (
                            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                              {step.image.caption}
                            </Typography>
                          )}
                        </Box>
                      )}

                      {step.video && step.video.src && (
                        <Box
                          sx={{
                            maxWidth: "100%",
                            borderRadius: "4px",
                            overflow: "hidden",
                            border: "1px solid #ddd",
                          }}
                        >
                          <video
                            controls
                            style={{
                              width: "100%",
                              height: "auto",
                              display: "block",
                            }}
                            aria-label={step.video.caption || "Video tutorial"}
                          >
                            <source src={`${process.env.NEXT_PUBLIC_S3_URL}${step.video.src}`} type="video/mp4" />
                            <track kind="captions" srcLang="es" label="Spanish captions" />
                            Tu navegador no soporta el elemento de video.
                          </video>
                        </Box>
                      )}
                    </Box>
                  ))}
                </Box>
              );

            case "video":
              return (
                <Box key={`section-${generateUniqueKey()}`} sx={{ my: 4 }}>
                  <Typography variant="h3" gutterBottom>
                    Video Tutorial
                  </Typography>
                  <Typography variant="h4" gutterBottom>
                    {section.text}
                  </Typography>
                  <Box
                    sx={{
                      maxWidth: "100%",
                      borderRadius: "4px",
                      overflow: "hidden",
                      border: "1px solid #ddd",
                    }}
                  >
                    <video
                      controls
                      style={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                      }}
                      poster={imageMap[section.content.poster]}
                      aria-label={section.content.caption || "Video tutorial"}
                    >
                      <source src={getVideoPath(section.content.src)} type="video/mp4" />
                      <track kind="captions" srcLang="es" label="Spanish captions" />
                      Tu navegador no soporta el elemento de video.
                    </video>
                  </Box>
                  {section.content.caption && (
                    <Typography variant="h5" display="block" sx={{ mt: 1 }}>
                      {section.content.caption}
                    </Typography>
                  )}
                </Box>
              );

            case "notes":
              return (
                <Paper
                  key={`section-${generateUniqueKey()}`}
                  elevation={0}
                  sx={{
                    my: 4,
                    p: 3,
                    bgcolor: "background.paper",
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography variant="h3" gutterBottom>
                    {section.content.title}
                  </Typography>
                  <List dense sx={{ pl: 2, listStyleType: "disc", listStylePosition: "inside" }}>
                    {section.content.items.map((note: string) => (
                      <ListItem key={`note-${generateUniqueKey()}`} sx={{ display: "list-item", py: 0, pl: 1 }}>
                        <ListItemText primary={note} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              );

            default:
              return null;
          }
        })}
    </>
  );
};

export default ArticleRenderer;
