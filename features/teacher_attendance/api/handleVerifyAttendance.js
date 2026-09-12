import { api } from "@/lib/axios";

export async function handleVerifyAttendance({attendanceId}){
    await api.post('/teacherAttendance/verify',{attendanceId});
}