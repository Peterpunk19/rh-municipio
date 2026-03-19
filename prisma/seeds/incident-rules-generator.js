function generateRules({ employee_type_id, incidentConfigs, months = [] }) {
  const rules = [];

  for (const config of incidentConfigs) {
    const { incident_id, min_years, max_years, days, allMonths = false } = config;

    const targetMonths = allMonths ? [{ start_date: null, end_date: null }] : months;

    for (const { start_date, end_date } of targetMonths) {
      const rule = {
        incident_id,
        employee_type_id,
        days,
        start_date,
        end_date,
        min_years,
        active: true,
      };

      if (max_years !== undefined) {
        rule.max_years = max_years;
      }

      rules.push(rule);
    }
  }

  return rules;
}

const generateForAllEmployeeTypes = (employeeTypes, incident_id, config = {}) => {
  return Object.values(employeeTypes).flatMap((employee_type_id) =>
    generateRules({
      employee_type_id,
      incidentConfigs: [
        {
          incident_id,
          ...config,
        },
      ],
    }),
  );
};

module.exports = { generateRules, generateForAllEmployeeTypes };
