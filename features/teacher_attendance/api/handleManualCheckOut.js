import { api } from "@/lib/axios";

export async function handleManualCheckout({checkOutDate,attendanceId,teacherId}) {
        await api.patch('/teacherAttendance/manualCheckout',{checkOutDate,attendanceId,teacherId});
  }