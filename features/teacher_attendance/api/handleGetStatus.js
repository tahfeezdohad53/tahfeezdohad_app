import { api } from "@/lib/axios";
import toast from "react-hot-toast";

export async function handleGetStatus(){
    try{
        const {data} = await api.get('/teacherAttendance/status');
        return data;
    }catch(err){
        toast.error('failed to load data!');
        throw err;
    }
}