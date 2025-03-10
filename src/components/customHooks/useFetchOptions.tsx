import { useEffect, useState } from "react";
import { ICatalog } from "@/utils/types";

export const useFetchOptions = (fetchFunction: (param?: any) => Promise<any>, param?: any) => {
  const [options, setOptions] = useState<ICatalog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchFunction(param);
        setOptions([]);

        if (response?.responseObject) {
          setOptions(response.responseObject);
        }
      } catch (err) {
        setError((err as Error).message || "Failed to fetch data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fetchFunction, param]);

  return { options, isLoading, error };
};
