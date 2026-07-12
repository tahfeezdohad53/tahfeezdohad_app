'use client';

import { useSession } from "next-auth/react";
import { useUser } from "../providers/UserProvider";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

function InfoFields() {
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
    return (
      <>
        <div className="flex flex-col gap-2">
          <label className="text-[#6f542d] text-sm">Email</label>

          <input
            type="email"
            value={user?.email || ""}
            readOnly
            disabled
            placeholder="Enter your email"
            className="bg-white/70 border text-sm font-bold border-[#d8c08e] text-[#4d3718] rounded-xl px-4 py-3 outline-none focus:border-[#8b6a36] focus:bg-white transition placeholder:text-[#9a8259]"
          />
        </div>

        {/* Name */}
        <div className="flex flex-col gap-2">
          <label className="text-[#6f542d] text-sm">Name</label>

          <input
            name="name"
            type="text"
            value={user?.name || ""}
            readOnly
            disabled
            placeholder="Enter your name"
            className="bg-white/70 border text-sm font-bold border-[#d8c08e] text-[#4d3718] rounded-xl px-4 py-3 outline-none focus:border-[#8b6a36] focus:bg-white transition placeholder:text-[#9a8259]"
          />
        </div>
      </>
    );
}

export default InfoFields
