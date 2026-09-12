import { useMutation, useQueryClient } from "@tanstack/react-query"
import { handleVerifyAttendance } from "../api/handleVerifyAttendance"
import toast from "react-hot-toast"

function useVerifyAttendance() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({attendanceId}) => handleVerifyAttendance({attendanceId}),
        onError: () => toast.error('failed to verify Attendance!'),
        onSuccess:() => {
            toast.success('attendance verified!');
            queryClient.invalidateQueries({queryKey:['teacherAttendance']})
        }
    })
}

export default useVerifyAttendance
