'use client';
import { useEffect, useState } from "react";
import ScrollToTopButton from "../ScrollToTopButton";
import LeaveCardsContainer from "./LeaveCardsContainer";
import LeaveFilters from "./LeaveFilters";
import LeaveStatisticCards from "./LeaveStatisticCards";
import { useUser } from "../providers/UserProvider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function LeaveWrapper() {
    const [show,setShow] = useState(true);
        const router = useRouter();
    
    const {user,isFetching} = useUser();
    const session = useSession();
    useEffect(() => {
        if(session.status === "loading") return;
        if(isFetching) return;
        if(user?.role === 'student') router.replace('/gurfah');
        if(!user?._id) {
          router.replace("/auth");
        }
        
      },[user?.role,session?.status,isFetching])
    return (
      <div className={`flex flex-col gap-5 p- rounded-md ${show && 'p-3'}`}>
        {show && <LeaveStatisticCards />}

        {show && <LeaveFilters />}
        <LeaveCardsContainer setShow={setShow} show={show}/>
        {/* <ScrollToTopButton /> */}
      </div>
    );
}

export default LeaveWrapper
