"use client";

import React, { useState } from "react";
import { Button, MenuItem, Box, SelectChangeEvent } from "@mui/material";
import { IconDownload } from "@tabler/icons-react";
import { pdf } from "@react-pdf/renderer";
import { PDFGeneratorProps, PDFOption } from "@/interfaces/PDFGeneratorProps";
import CustomSelect from "@/app/components/forms/theme-elements/CustomSelect";

const PDFGenerator: React.FC<PDFGeneratorProps> = ({
  data,
  fileName = "documento",
  title = "Documento",
  template: CustomTemplate,
  buttonProps = {},
  optionsConfig,
  buttonLabel,
}) => {
  const options = optionsConfig?.options || [];
  const displayMode = optionsConfig?.displayMode || (options.length === 1 ? "button" : "dropdown");
  const defaultOption = optionsConfig?.defaultOption || (options.length > 0 ? options[0].value : "default");

  const [selectedOption, setSelectedOption] = useState<string>("default");

  const handleDownload = async (option?: PDFOption) => {
    if (!option) return;

    const doc = <CustomTemplate data={data} title={title} />;
    const blob = await pdf(doc).toBlob();

    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `${option.fileName || fileName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);

    setSelectedOption(defaultOption);
  };

  const renderDropdown = () => (
    <Box>
      <CustomSelect
        displayEmpty
        value={selectedOption}
        renderValue={() => "Descargar formato"}
        onChange={async (e: SelectChangeEvent<string>) => {
          const value = e.target.value as string;
          setSelectedOption(value);
          const selected = options.find((opt) => opt.value === value);
          await handleDownload(selected);
        }}
        sx={{
          height: "40px",
          "& .MuiSelect-select": {
            paddingTop: "8px",
            paddingBottom: "8px",
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </CustomSelect>
    </Box>
  );

  const renderButton = () => {
    const option = options.find((opt) => opt.value === defaultOption) || {
      value: "default",
      label: "Descargar",
      fileName: fileName,
    };

    return (
      <Button
        variant="outlined"
        color="primary"
        startIcon={<IconDownload />}
        onClick={() => handleDownload(option)}
        {...buttonProps}
      >
        {buttonLabel || "Descargar formato"}
      </Button>
    );
  };

  return displayMode === "dropdown" ? renderDropdown() : renderButton();
};

export default PDFGenerator;
