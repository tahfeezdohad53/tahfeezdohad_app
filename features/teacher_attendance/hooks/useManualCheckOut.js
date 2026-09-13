"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { handleManualCheckout } from "../api/handleManualCheckOut";

function useManualCheckOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: handleManualCheckout,
    onSuccess: () => {
      toast.success("Checked Out!", { id: "checkOut" });
      queryClient.invalidateQueries({ queryKey: ["teacherAttendance"] });
    },
    onError: () => toast.error("Failed to check out!", { id: "checkOut" }),
  });
}

export default useManualCheckOut;
