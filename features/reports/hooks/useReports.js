'use client';

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getReports } from "../api/getReports";
import { useSearchParams } from "next/navigation";

function useReports() {
    const searchParams = useSearchParams();
    const student = searchParams.get('student');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    return useQuery({
        queryKey:['reports',student,startDate,endDate],
        queryFn:() => getReports({student,startDate,endDate}),
        refetchOnWindowFocus:false,
        placeholderData:keepPreviousData,
    })
}

export default useReports
