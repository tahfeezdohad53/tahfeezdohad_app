import { api } from "@/lib/axios";

export async function handleGetAttendance({page}){
    const { data} = await api.get(`/teacherAttendance/get?page=${page}`);
    console.log(data);
    return data;
}