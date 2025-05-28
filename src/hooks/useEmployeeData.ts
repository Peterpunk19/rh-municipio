"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getEmployeeById } from "@/services/employees";
import { StatusCodes } from "http-status-codes";
import { logger } from "@/lib/logger";

export const useEmployeeData = () => {
  const { data: session, status } = useSession();
  const [employeeData, setEmployeeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchEmployee = async () => {
      try {
        const response = await getEmployeeById(session.user.employee_id);
        if (response.statusCode === StatusCodes.OK) {
          setEmployeeData(response.responseObject);
        } else {
          setError("Employee not found");
        }
      } catch (error: any) {
        logger.error({ error: error.message, stack: error.stack });
        setError("Failed to fetch employee data");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [session?.user?.id]);

  return { employeeData, loading, error, sessionStatus: status };
};
