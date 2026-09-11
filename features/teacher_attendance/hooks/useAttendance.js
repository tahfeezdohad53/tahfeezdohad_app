"use client";

import { useQuery } from "@tanstack/react-query";
import { handleGetAttendance } from "../api/handleGetAttendance";
import useFilter from "@/shared/hooks/useFilter";

function useAttendance() {
  const {searchParams} = useFilter();
  const page = searchParams.get('page');

  return useQuery({
    queryKey: ["teacherAttendance",page],
    queryFn: () => handleGetAttendance({page}),
    refetchOnWindowFocus: false,
  });
}

export default useAttendance;
