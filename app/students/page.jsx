import Image from "next/image";
import Link from "next/link"
import { FaUser, FaUserCircle } from "react-icons/fa"
import { FaArrowLeftLong } from "react-icons/fa6";
import ProtectRoutes from "../_components/auth/ProtectRoutes";
import { auth } from "@/auth";
import StudentCard from "../_components/students/StudentCard";
import StudentsContainer from "../_components/students/StudentsContainer";

async function Page() {
 
    const session = await auth();
    
    return (
      <ProtectRoutes>
        <div className=" h-full">
          <div className="mt-10 flex items-center justify-center w-full ">
            <h1 className="w-fit bg-amber-800 px-10 py-2 rounded-tl-full rounded-br-full shadow border border-(--border) font-semibold text-xl text-white tracking-wide">
              {session?.user?.name}&apos;s diary
            </h1>
          </div>
          {/* <hr className="mt-5 text-amber-400"/> */}
          <div className="px-5 mt-10">
            <StudentsContainer session={session}/>
          </div>
        </div>
      </ProtectRoutes>
    );
}

export default Page
