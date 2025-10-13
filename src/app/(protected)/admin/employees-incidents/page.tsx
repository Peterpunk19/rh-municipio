"use client";
import React from "react";
import EmployeesIncidents from "@/app/(protected)/admin/employees-incidents/EmployeesIncidents";

const BCrumb = [
  {
    to: "/admin/employees-incidents",
    title: "Incidencias de empleados",
  },
];

export default function Page({}) {
  return <EmployeesIncidents />;
}
