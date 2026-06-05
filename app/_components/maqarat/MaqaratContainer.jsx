'use client';
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaUserFriends } from "react-icons/fa";
import { GiOpenBook } from "react-icons/gi";
import { IoBookOutline, IoCalendarOutline } from "react-icons/io5";
import { LuUsers } from "react-icons/lu";
import { useUser } from "../providers/UserProvider";
import { format } from "date-fns";

function MaqaratContainer({query}) {
    const {user} = useUser();
    const {data:maqarat,isLoading} = useQuery({
        queryKey:['maqarat',query],
        queryFn:handleGetMaqarat,
        refetchOnWindowFocus:false,
        placeholderData:keepPreviousData
    })
    async function handleGetMaqarat(){
        try{
            const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/maqarat/get?batch=${query?.batch || ''}&status=${query?.status || ''}`,{withCredentials:true});
            console.log('sucess')
            console.log(res.data.maqarat.length)
            return res.data.maqarat; 
        }catch(err){
            console.log(err);
            return [];
        }
    }
    if(!user) return null;
    if(isLoading) return null;
    if(!isLoading && maqarat?.length === 0) return (
      <div className="w-full h-100 flex items-center justify-center">
       {user?.role === 'admin' && <h1>Start Creating Maqarat Session</h1>}
       {(user?.role === 'student' || user?.role === 'teacher') && <h1>No sessions found!</h1>}
      </div>
    );
    return (
      // <h1>hello</h1>
      <div className="">
        <div className="lg:grid lg:grid-cols-3 flex flex-col gap-3 mt-3">
          {maqarat.map(el => <MaqaratSessionCard key={el._id} juz={el.juz} batch={el.batch} teacher={el.teacher.name} date={el.date} students={el.students}/>)}
          {/* {maqarat.map(el => <MaqaratSessionCard key={el._id} juz={el.juz} batch={el.batch} teacher={el.teacher.name} date={el.date} students={el.students}/>)} */}
        </div>
      </div>
    );
}

export default MaqaratContainer

const month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
function MaqaratSessionCard({ juz, batch, teacher, date, students }) {
  const today = new Date();
  const sessionDate = new Date(date);

  today.setHours(0, 0, 0, 0);
  sessionDate.setHours(0, 0, 0, 0);

  const isUpcoming = sessionDate > today;
  const isToday = sessionDate.getTime() === today.getTime();

  const statusColor = isToday
    ? "bg-blue-500"
    : isUpcoming
      ? "bg-green-500"
      : "bg-red-500";
  const highlightColor = isToday
    ? "bg-blue-500/25"
    : isUpcoming
      ? "bg-green-500/25"
      : "bg-red-500/25";
  const textColor = isToday
    ? "text-blue-500"
    : isUpcoming
      ? "text-green-500"
      : "text-red-500";
  const border = isToday
    ? "border-l-blue-500"
    : isUpcoming
      ? "border-l-green-500"
      : "border-l-red-500";

  const statusText = isToday ? "Today" : isUpcoming ? "Upcoming" : "Ended";

  return (
    <div className={`border-l-3 ${border} bg-white p-4 flex gap-4 relative rounded-sm border border-(--border) shadow-(--shadow-sm) overflow-hidden`}>
      {/* Header */}
        <span
          className={`${statusColor} absolute top-4 right-4 text-white text-xs px-3 py-1 rounded-full`}
        >
          {statusText}
        </span>
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-3">
          <div className={`h-14 w-14 rounded-2xl bg-(--bg-tertiary)/50 flex items-center justify-center ${highlightColor}`}>
            <IoCalendarOutline size={24} />
          </div>

          <div className="flex flex-col items-center">
            {/* <h2 className="font-bold text-lg">{juz}</h2> */}
            <p className={` font-semibold text-lg`}>
              {/* {format(date, "dd MMM yyyy")} */}
              {month.at(new Date(date).getMonth())}
            </p>
            <p className={`text-4xl font-bold`}>{new Date(date).getDate()}</p>
            <p className="text-md text-gray-700">{new Date(date).getFullYear()}</p>
          </div>
        </div>

      </div>

      {/* Details */}
      <div className="px-4 w-full pb-4 flex flex-col gap-3 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <LuUsers className={`${textColor}`}/>
          <p>Batch: {batch}</p>
        </div>

        <div className="flex items-center gap-2">
          <LuUsers className={`${textColor}`}/>
          <p>Teacher: {teacher}</p>
        </div>

        <div className="flex items-center gap-2">
          <LuUsers className={`${textColor}`}/>
          <p>{students?.length} Students</p>
        </div>

        <div className="flex items-center gap-2">
          <IoCalendarOutline className={`${textColor}`}/>
          <p>{format(date, "dd MMM, yyyy")}</p>
        </div>
      <div className="border-t border-(--border) pt-3">
        <h3 className="font-semibold text-amber-700 mb-3">
          Students ({students?.length})
        </h3>

        <div className="flex flex-wrap gap-2">
          {students?.map((student) => (
            <div
              key={student?.name}
              className="px-3 py-1 rounded-full bg-gray-100 text-xs"
            >
              {student?.name}
            </div>
          ))}
        </div>
      </div>
      </div>

      {/* Students */}
    </div>
  );
}
