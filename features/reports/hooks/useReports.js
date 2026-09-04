'use client';

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getReports } from "../api/getReports";

function useReports() {
    return useQuery({
        queryKey:['reports'],
        queryFn:getReports,
        refetchOnWindowFocus:false,
        placeholderData:keepPreviousData,
    })
}

export default useReports
