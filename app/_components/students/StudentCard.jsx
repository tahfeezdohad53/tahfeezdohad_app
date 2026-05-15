'use client';
import Image from "next/image";
import Link from "next/link";
import { BiDotsVertical } from "react-icons/bi";
import { FaMicrophone, FaUserCircle } from "react-icons/fa";

function StudentCard({
  image,
  name,
  studentId,
  proxyTeacherId,
  teacherId,
  teacherName,
  proxyTeacherName,
}) {
  const isProxy = proxyTeacherId === teacherId;

  
  return (
    <div className="flex justify-center">
      <div className="relative rounded-md w-[80%] border-t-4 border-amber-900 bg-(--layer) shadow border border-x-(--border) border-b-(--border)">
        {isProxy && (
          <div className="flex justify-center">
            <p className=" px-6 text-xs rounded-full shadow-sm my-1 p-1 bg-(--background)">
              proxy
            </p>
          </div>
        )}
        {!isProxy && <button
          data-studentid={studentId}
          data-studentname={name}
          data-teachername={teacherName}
          data-proxyteachername={proxyTeacherName}
          className="menu-btn absolute right-2 top-2 w-8 flex justify-center py-1"
        >
          <BiDotsVertical className=" text-lg" />
        </button>}
        <div
          // href={`/entry/${studentId}`}
          className={` flex flex-col items-center justify-center ${!isProxy && "h-full"} w-full p-4 rounded-md  gap-2`}
        >
          {image && (
            <div className="relative h-18 w-18 rounded-full overflow-hidden">
              <Image src={image} alt="user photo" fill />
            </div>
          )}
          {!image && <FaUserCircle className="text-5xl text-amber-950" />}
          <p className="font-semibold text-stone-800 tracking-wider text-xs text-center">
            {name}
          </p>
          <Link
            href={`/entry/${studentId}?studentName=${name}`}
            className="border rounded-full shadow-md p-2 bg-amber-800 text-white"
          >
            <FaMicrophone className="" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default StudentCard
