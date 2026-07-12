'use client';
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import RecordingEntry from "../RecordingEntry";
import RecordingsTableController from "./RecordingsTableController";
import axios from "axios";
import { useUser } from "../providers/UserProvider";
import toast from "react-hot-toast";
import { PiStudent } from "react-icons/pi";
import { CiCalendar, CiClock2, CiUser } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

function RecordingsContainer({params}) {
  const {user,isFetching} = useUser();
      const router = useRouter();
          const session = useSession();
          useEffect(() => {
              if(session.status === "loading") return;
              if(isFetching) return;
              if(user?.role === 'student') router.replace('/gurfah');
              if(!user?._id) {
                router.replace("/auth");
              }
              
            },[user?.role,session?.status,isFetching])
     const { data: recordingsData } = useQuery({
       queryKey: ["recordings",params],
       queryFn: getRecordings,
       refetchOnWindowFocus: false,
       placeholderData:keepPreviousData,
       enabled:!!user?.name,
     });
     async function getRecordings(){
         try {
           const res = await axios.get(
             `${process.env.NEXT_PUBLIC_URL}/recording/getRecordings?page=${params.page || 1}&student=${params.student || ""}&teacher=${params.teacher || ""}&startDate=${params.startDate || ""}&endDate=${params.endDate || ""}`,
             {
               withCredentials:true,
             },
           );
           console.log(res.data)
           return res.data;
         } catch (err) {
           return [];
         }
     }
     if(user?.role === 'student' || user?.role === 'teacher'){
      return (
        <div className="h-[75vh] flex items-center justify-center">
          <h1>you are not authorized to access this page</h1>
        </div>
      );
     }
    if(recordingsData?.recordings?.length > 0)return (
      <div className="bg-(--card) shadow border border-(--border)">
        <div className="py-4 px-3 w-full grid grid-cols-9 bg-(--bg-tertiary)/40 font-semibold">
          <div className="flex items-center gap-1 col-span-3 text-xs text-left">
            <CiCalendar className="text-sm" />
            Date
          </div>
          <div className="text-left">
            <CiClock2 />
          </div>
          <div className="flex items-center gap-1 col-span-2 text-[0.50rem] lg:text-xs text-left">
            <CiUser className="text-sm" /> Student
          </div>
          <div className="flex items-center gap-1 col-span-2 text-[0.50rem] lg:text-xs text-left">
            <PiStudent className="text-sm" /> Muhaffiz
          </div>
          <div className="text-[0.50rem] flex justify-center">Actions</div>
        </div>
        <div className="space-y-">
          {recordingsData?.recordings?.map((el, i) => (
            <RecordingEntry key={el._id} el={el} i={i} />
          ))}
          {Array.from({ length: 10 - recordingsData?.recordings?.length }).map(
            (el, i) => (
              <RecordingEntry key={i} isDummy />
            ),
          )}
          <RecordingsTableController totalRes={recordingsData?.totalResults} />
        </div>
      </div>
    );
}

export default RecordingsContainer
