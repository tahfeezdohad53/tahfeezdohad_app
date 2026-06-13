'use client';
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import LeaveCard from "./LeaveCard"
import axios from "axios";
import { useSearchParams } from "next/navigation";

function LeaveCardsContainer() {
    const query = useSearchParams();
    const {data:leaves} = useQuery({
        queryKey:['leaves',query.get('status'),query.get('user')],
        queryFn:handleGetLeaves,
        placeholderData:keepPreviousData
    });

    async function handleGetLeaves(){
        try{
            const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/leave/get?status=${query.get('status') || ''}&user=${query.get('user') || ''}`,{withCredentials:true});
            return res.data.leaves;
        }catch(err){
            console.log(err);
            return [];
        }
    }
    // if(leaves?.length < 1) return <div className="text-center mt-15 font-bold">Apply For Leave</div>
    return (
      <div>
        <h1 className="font-bold mb-2 text-2xl">Leaves</h1>
        <div className="lg:grid grid-cols-3 flex flex-col gap-3">
          {leaves?.map((el) => (
            <LeaveCard
              key={el._id}
              id={el._id}
              createdAt={el.createdAt}
              status={el.status}
              reason={el.reason}
              name={el.name}
              batch={el.batch}
              type={el.type}
              from={el.from}
              to={el.to}
              days={el.days}
            />
          ))}
        </div>
      </div>
    );
}

export default LeaveCardsContainer
