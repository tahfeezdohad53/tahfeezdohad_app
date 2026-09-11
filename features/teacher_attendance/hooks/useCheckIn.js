'use client';

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleCheckIn } from "../api/handleCheckIn";
import toast from "react-hot-toast";

function useCheckIn() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn:handleCheckIn,
        onSuccess:() => {
            toast.success("Checked In!",{id:'checkIn'});
            queryClient.invalidateQueries({queryKey:['token']});
            queryClient.invalidateQueries({ queryKey: ["teacherAttendance"] });
        },
        onError:() => toast.error('Failed to check in!',{id:'checkIn'}),
    })
}

export default useCheckIn
