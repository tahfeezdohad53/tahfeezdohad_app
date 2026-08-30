'use client'

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { handleUpdateStudent } from "../api/handleUpdateStudent";
import toast from "react-hot-toast";

function useUpdateStudent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn:handleUpdateStudent,
        onSuccess:(_,{type}) => {
            if(type === 'diary') toast.success('student diary updated');
            queryClient.invalidateQueries({queryKey:['myStudents']});
        }
    });
}

export default useUpdateStudent
