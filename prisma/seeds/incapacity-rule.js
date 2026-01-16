const incapacityRule = [
  {
    id: 1,
    config_year_id: 2,
    min_years: 0,
    max_years: 1,
    full_salary_days: 15,
    half_salary_days: 15,
    active: true,
  },
  {
    id: 2,
    config_year_id: 2,
    min_years: 1,
    max_years: 5,
    full_salary_days: 30,
    half_salary_days: 30,
    active: true,
  },
  {
    id: 3,
    config_year_id: 2,
    min_years: 5,
    max_years: 10,
    full_salary_days: 45,
    half_salary_days: 45,
    active: true,
  },
  {
    id: 4,
    config_year_id: 2,
    min_years: 10,
    max_years: 100,
    full_salary_days: 60,
    half_salary_days: 60,
    active: true,
  },
];
module.exports = incapacityRule;
