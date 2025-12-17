"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export function useTabsWithQueryParam<T extends Record<string, number>>(tabMap: T, defaultTab: keyof T) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [value, setValue] = useState(tabMap[defaultTab]);

  useEffect(() => {
    const tab = searchParams.get("tab") as keyof T | null;

    if (tab && tabMap[tab] !== undefined) {
      setValue(tabMap[tab]);
    }
  }, [searchParams, tabMap]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    const tabKey = Object.keys(tabMap).find((key) => tabMap[key as keyof T] === newValue);

    if (tabKey) {
      router.replace(`?tab=${tabKey}`, { scroll: false });
    }

    setValue(newValue);
  };

  return { value, handleTabChange };
}
