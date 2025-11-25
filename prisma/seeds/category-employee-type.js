const categories = require("./category");
const employeeTypes = require("./employee-type");

const categoryEmployeeType = [];

categories.forEach((category) => {
  employeeTypes.forEach((employeeType) => {
    categoryEmployeeType.push({
      category_id: category.id,
      employee_type_id: employeeType.id,
      salary: 0,
      config_year_id: 1,
    });
  });
});

module.exports = categoryEmployeeType;
