import { api } from "@/lib/axios";

export async function handleCheckOut(){
    await api.post('/teacherAttendance/checkOut');
}