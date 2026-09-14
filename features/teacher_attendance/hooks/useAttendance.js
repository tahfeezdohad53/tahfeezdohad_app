"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { handleGetAttendance } from "../api/handleGetAttendance";
import useFilter from "@/shared/hooks/useFilter";

function useAttendance() {
  const {searchParams} = useFilter();
  const page = searchParams.get('page');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const teacher = searchParams.get('teacher');
  const batch = searchParams.get('batch');

  return useQuery({
    queryKey: ["teacherAttendance",page,startDate,endDate,teacher,batch],
    queryFn: () => handleGetAttendance({page,startDate,endDate,teacher,batch}),
    placeholderData:keepPreviousData,
    refetchOnWindowFocus: false,
  });
}

export default useAttendance;
