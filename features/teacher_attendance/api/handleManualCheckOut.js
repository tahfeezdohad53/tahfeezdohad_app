import { api } from "@/lib/axios";

export async function handleManualCheckout({checkOutDate,attendanceId,teacherId,type}) {
        await api.patch('/teacherAttendance/manualCheckout',{checkOutDate,attendanceId,teacherId,type});
  }