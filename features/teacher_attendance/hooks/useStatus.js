'use client'

import { useQuery } from "@tanstack/react-query"
import { handleGetStatus } from "../api/handleGetStatus"

function useStatus() {
    return useQuery({
        queryKey:['teacherAttendanceStatus'],
        queryFn:handleGetStatus,
        refetchOnWindowFocus:false,
    })
}

export default useStatus
