import { useEffect, useState } from "react";
import { ICatalog } from "@/utils/types";

export const useFetchOptions = (fetchFunction: () => Promise<any>) => {
  const [options, setOptions] = useState<ICatalog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchFunction();
        if (response?.responseObject) {
          setOptions(response.responseObject);
        } else {
          throw new Error("Invalid response from the server.");
        }
      } catch (err) {
        setError((err as Error).message || "Failed to fetch data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fetchFunction]);

  return { options, isLoading, error };
};
