'use client';

import { useMutation } from "@tanstack/react-query";
import { handleCheckIn } from "../api/handleCheckIn";
import toast from "react-hot-toast";

function useCheckIn() {
    return useMutation({
        mutationFn:handleCheckIn,
        onSuccess:() => toast.success('Checked In!'),
        onError:() => toast.error('Failed to check in!'),
    })
}

export default useCheckIn
