'use client';

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getReports } from "../api/getReports";
import { useSearchParams } from "next/navigation";

function useReports() {
    const searchParams = useSearchParams();
    const student = searchParams.get('student');

    return useQuery({
        queryKey:['reports',student],
        queryFn:() => getReports({student}),
        refetchOnWindowFocus:false,
        placeholderData:keepPreviousData,
    })
}

export default useReports
