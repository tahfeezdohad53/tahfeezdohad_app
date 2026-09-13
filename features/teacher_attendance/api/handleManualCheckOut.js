import { api } from "@/lib/axios";

export async function handleManualCheckout({checkoutHour,checkoutMinute,attendanceId,teacherId}) {
    if (checkoutHour === "" || checkoutMinute === "") return;
        await api.patch('/teacherAttendance/manualCheckout',{checkoutHour,checkoutMinute,attendanceId,teacherId});
  }