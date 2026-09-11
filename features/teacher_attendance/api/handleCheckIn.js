import { api } from "@/lib/axios";

export async function handleCheckIn({batch}){
    await api.post('/teacherAttendance/checkIn',{batch});
}