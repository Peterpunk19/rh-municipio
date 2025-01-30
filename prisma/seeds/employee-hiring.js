const { faker } = require("@faker-js/faker");

const employeeHiring = [];
const NUM_FAKE_EMPLOYEES = 10;

for (let i = 0; i < NUM_FAKE_EMPLOYEES; i++) {
  employeeHiring.push({
    id: i + 1,
    employee_id: i + 1,
    start_job_date: faker.date.past({ years: 5 }),
    end_job_date: faker.date.future({ years: 2 }),
    category_id: 1,
    employee_type_id: 1,
    departamento_id: 1,
    payroll_id: 1,
    active: true,
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
  });
}

module.exports = employeeHiring;
