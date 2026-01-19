interface FormField {
  name: string;
  label: string;
  type: "text" | "date" | "select" | "switch";
  required: boolean;
  placeholder?: string;
  gridSize?: number;
  options?: Array<{ value: any; label: string }>;
}

interface FormConfig {
  fields: FormField[];
}

export function getCatalogFormConfig(catalogName: string): FormConfig {
  const baseFields: FormField[] = [
    {
      name: "display_name",
      label: "Nombre",
      type: "text",
      required: true,
      placeholder: "Nombre del registro",
      gridSize: 6,
    },
    {
      name: "active",
      label: "Activo",
      type: "switch",
      required: false,
      gridSize: 6,
    },
  ];

  const configs: Record<string, FormConfig> = {
    category: {
      fields: baseFields,
    },
    holiday: {
      fields: [
        ...baseFields,
        {
          name: "holiday_date",
          label: "Fecha del día festivo",
          type: "date",
          required: true,
          gridSize: 6,
        },
        {
          name: "validation_date",
          label: "Fecha de validación",
          type: "date",
          required: true,
          gridSize: 6,
        },
      ],
    },
    location: {
      fields: baseFields,
    },
    "marital-status": {
      fields: baseFields,
    },
    schooling: {
      fields: [
        ...baseFields,
        {
          name: "cve_code",
          label: "Código CVE",
          type: "text",
          required: true,
          placeholder: "Código de clasificación",
          gridSize: 6,
        },
      ],
    },
    occupation: {
      fields: [
        ...baseFields,
        {
          name: "cve_code",
          label: "Código CVE",
          type: "text",
          required: true,
          placeholder: "Código de clasificación",
          gridSize: 6,
        },
      ],
    },
    profession: {
      fields: baseFields,
    },
    secretaria: {
      fields: baseFields,
    },
    direccion: {
      fields: [
        ...baseFields,
        {
          name: "secretaria_id",
          label: "Secretaría",
          type: "select",
          required: true,
          gridSize: 6,
        },
      ],
    },
    "trade-union": {
      fields: baseFields,
    },
  };

  return configs[catalogName] || { fields: baseFields };
}
