const { faker } = require("@faker-js/faker");

const user = [];
const NUM_FAKE_USERS = 10;

for (let i = 0; i < NUM_FAKE_USERS; i++) {
  user.push({
    id: i + 1,
    uuid: faker.string.uuid(),
    username: faker.internet.username(),
    password: faker.internet.password(),
    set_password_key: faker.string.alphanumeric(10),
    active: faker.datatype.boolean(),
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
    role_id: 1,
  });
}
module.exports = user;
