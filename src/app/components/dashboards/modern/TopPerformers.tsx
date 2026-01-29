import React from 'react';
import DashboardCard from '../../shared/DashboardCard';
import EmployeeFinder from "@/components/shared/EmployeeFinder";

const TopPerformers = () => {
  const handleEmployeeSelect = (employee: any) => {
    console.log(employee)
  };

  return (
    <DashboardCard
      title="Empleados"
    >
      <EmployeeFinder
        onEmployeeSelect={handleEmployeeSelect}
        error=""
        label=""
      />
    </DashboardCard>
  );
};

export default TopPerformers;
