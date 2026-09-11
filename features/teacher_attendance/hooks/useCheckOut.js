'use client';

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { handleCheckOut } from "../api/handleCheckOut";

function useCheckOut() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn:handleCheckOut,
        onSuccess:() => {
            toast.success("Checked Out!",{id:'checkOut'});
            queryClient.invalidateQueries({queryKey:['token']});
            queryClient.invalidateQueries({queryKey:['teacherAttendance']});
        },
        onError:() => toast.error('Failed to check out!',{id:'checkOut'}),
    })
}

export default useCheckOut
