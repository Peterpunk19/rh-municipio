const categories = require("./category");
const employeeTypes = require("./employee-type");

function generateRandomSalary(min = 15000, max = 80000) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const categoryEmployeeType = [];

categories.forEach((category) => {
  employeeTypes.forEach((employeeType) => {
    categoryEmployeeType.push({
      category_id: category.id,
      employee_type_id: employeeType.id,
      salary: generateRandomSalary(),
    });
  });
});

module.exports = categoryEmployeeType;
