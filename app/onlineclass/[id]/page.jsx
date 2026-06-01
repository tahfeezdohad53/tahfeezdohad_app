import StudentContainer from "@/app/_components/gurfah/StudentContainer";
import StudentWrapper from "@/app/_components/student_gurfah/StudentWrapper";
import { auth } from "@/auth"
import Link from "next/link";
import { redirect } from "next/navigation";
import { IoMdArrowRoundBack } from "react-icons/io";

async function Page({params}) {
    // const session = await auth();
    // if(session.currentUser.role === 'student') redirect('/auth');
    const pageParams = await params;
    return (
      <div className="py-5 px-5 h-full">
        <div className="flex items-center gap-1 text-sm text-(--text)">
          <button className="shadow-(--shadow-md) bg-(--card) rounded-lg p-2">
            <Link href={"/gurfah"} className="">
              <IoMdArrowRoundBack />
            </Link>
          </button>
          Back
        </div>
        <StudentWrapper id={pageParams.id}/>
      </div>
    );
}

export default Page
