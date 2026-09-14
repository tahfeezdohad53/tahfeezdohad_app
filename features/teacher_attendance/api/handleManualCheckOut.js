import { api } from "@/lib/axios";

export async function handleManualCheckout({checkOutDate,attendanceId,teacherId}) {
    if (checkoutHour === "" || checkoutMinute === "") return;
        await api.patch('/teacherAttendance/manualCheckout',{checkOutDate,attendanceId,teacherId});
  }