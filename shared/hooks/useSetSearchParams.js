"use client";

import { useEffect } from "react";
import useFilter from "./useFilter";

function useSetSearchParams({ paramsList = [], guardClause }) {
  const { router, pathname, searchParams, handleChangeSearchParams } = useFilter();

  useEffect(() => {
    if (!guardClause?.()) return;
    
    const params = new URLSearchParams(searchParams);
    paramsList.forEach((el) => {
      params.set(el.key, el.value);
    });
    router.replace(`${pathname}?${params}`);
  }, []);
}

export default useSetSearchParams;
