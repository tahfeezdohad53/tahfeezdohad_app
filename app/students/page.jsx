import Image from "next/image";
import Link from "next/link"
import { FaUser, FaUserCircle } from "react-icons/fa"
import { FaArrowLeftLong } from "react-icons/fa6";
import ProtectRoutes from "../_components/auth/ProtectRoutes";
import { auth } from "@/auth";
import StudentCard from "../_components/students/StudentCard";

async function Page() {
  const session = await auth();
  const res = await fetch(`${process.env.URL}/student/getStudents`,{headers:{Authorization:`Bearer ${session?.jwt}`}});
  const resJson = await res.json();
  console.log(resJson?.students);
    return (
      <ProtectRoutes>
        <div className=" h-full">
          <div className="mt-10 flex items-center justify-center w-full ">
            <h1 className="w-fit bg-amber-800 px-10 py-2 rounded-tl-full rounded-br-full shadow border border-(--border) font-semibold text-xl text-white tracking-wide">
              Huzefa ratlam&apos;s diary
            </h1>
          </div>
          {/* <hr className="mt-5 text-amber-400"/> */}
          <div className="px-5 mt-10">
            <div className="grid grid-cols-2 gap-y-6">
              {resJson?.students?.length > 0 &&
                resJson.students.map((el) => (
                  <StudentCard
                    key={el._id}
                    image={el?.profileImage}
                    name={el.name}
                    studentId={el._id}
                  />
                ))}
            </div>
          </div>
            {resJson.students?.length < 1 && <h1 className="absolute top-1/2 left-1/2 -translate-1/2 font-bold text-xl tracking-wider text-center w-3/4">you don&apos;t have any students tagged yet!</h1>}
        </div>
      </ProtectRoutes>
    );
}

export default Page
