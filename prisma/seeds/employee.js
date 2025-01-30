const { faker } = require("@faker-js/faker");

const employee = [];
const NUM_FAKE_EMPLOYEES = 10;

for (let i = 0; i < NUM_FAKE_EMPLOYEES; i++) {
  employee.push({
    id: i + 1,
    number_employee: faker.string.numeric(6),
    name: faker.person.firstName(),
    paternal_last_name: faker.person.lastName(),
    maternal_last_name: faker.person.lastName(),
    birthday: faker.date.past({ years: 30 }).toISOString().split("T")[0],
    rfc: faker.string.alphanumeric(13).toUpperCase(),
    curp: faker.string.alphanumeric(18).toUpperCase(),
    active: true,
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
    user_id: i + 1,
    status_employee_id: 1,
    gender_id: faker.number.int({ min: 1, max: 2 }),
    employee_hiring_id: i + 1,
    //director_id: faker.number.int({ min: 1, max: 10 }),
    //sustitute_id: faker.number.int({ min: 1, max: 10 }),
  });
}

module.exports = employee;
