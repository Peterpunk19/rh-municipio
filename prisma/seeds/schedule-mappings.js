const scheduleMappings = {
  "Lunes a Viernes": [
    {
      start_day: "monday",
      end_day: "friday",
    },
  ],
  "Lunes a Domingo": [
    {
      start_day: "monday",
      end_day: "sunday",
    },
  ],
  "Lunes a Sábado": [
    {
      start_day: "monday",
      end_day: "saturday",
    },
  ],
  "Fines de semana y Dias festivos": [
    {
      start_day: "saturday",
      end_day: "sunday",
    },
    {
      start_day: "holidays",
      end_day: "holidays",
    },
  ],
  "Martes a Sabado y Dias Festivos": [
    {
      start_day: "thursday",
      end_day: "sunday",
    },
    {
      start_day: "holidays",
      end_day: "holidays",
    },
  ],
  "Viernes, Fines de semana y Dias Festivos": [
    {
      start_day: "friday",
      end_day: "sunday",
    },
    {
      start_day: "holidays",
      end_day: "holidays",
    },
  ],
  Intercalados: [
    {
      start_day: "intercalated",
      end_day: "intercalated",
    },
  ],
};

module.exports = { scheduleMappings };
