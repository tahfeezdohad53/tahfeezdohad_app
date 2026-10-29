import { api } from "@/lib/axios";
import toast from "react-hot-toast";

export async function getReports({student,startDate,endDate}){
    try{
        const {data} = await api.get('/report/get',{params:{student,startDate,endDate}});
        return data.reports;
    }catch(err){
        toast.error('failed to fetch reports');
        throw err;
    }
}