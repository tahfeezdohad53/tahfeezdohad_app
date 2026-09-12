"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { handleGetAttendance } from "../api/handleGetAttendance";
import useFilter from "@/shared/hooks/useFilter";

function useAttendance() {
  const {searchParams} = useFilter();
  const page = searchParams.get('page');

  return useQuery({
    queryKey: ["teacherAttendance",page],
    queryFn: () => handleGetAttendance({page}),
    placeholderData:keepPreviousData,
    refetchOnWindowFocus: false,
  });
}

export default useAttendance;
