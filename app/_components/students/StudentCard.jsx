'use client';
import { formatName } from "@/helpers";
import Image from "next/image";
import Link from "next/link";
import { BiDotsVertical } from "react-icons/bi";
import { CiUser } from "react-icons/ci";
import { FaMicrophone, FaRegUser, FaUser, FaUserCircle } from "react-icons/fa";
import { LiaGraduationCapSolid } from "react-icons/lia";
import { LuGraduationCap } from "react-icons/lu";
import { SiGoogleclassroom } from "react-icons/si";

function StudentCard({
  image,
  name,
  studentId,
  proxyTeacherId,
  teacherId,
  teacherName,
  proxyTeacherName,
  isSelecting,
  setSelectedStudents,
  selectedStudents,
  classStatus,
  classDuration,
}) {
  const isProxy = proxyTeacherId === teacherId;

  function handleSelectedStudent(e){
    if(!e.target.checked){
      setSelectedStudents(arr => arr.filter(el => el !== studentId));
    }else{
      setSelectedStudents(arr => [...arr,studentId]);
    }
  }

  const formattedName = formatName(name);
  
  return (
    <div className="py relative rounded-md w-full lg:w-[15%]  border-amber-900 bg-(--card) shadow-(--shadow-xl) ">
      {isSelecting && (
        <input
          onChange={handleSelectedStudent}
          checked={selectedStudents.includes(studentId)}
          type="checkbox"
          className="absolute top-3 left-3"
        />
      )}

      {isProxy && (
        <div className="flex justify-center">
          <p className=" px-6 text-xs rounded-full shadow-sm my-1 p-1 bg-(--background)">
            proxy
          </p>
        </div>
      )}

      <button
        data-studentid={studentId}
        data-studentname={name}
        data-teachername={teacherName}
        data-proxyteachername={proxyTeacherName}
        className="menu-btn duration-300 ease-in-out transition-all hover:bg-(--card-hover) hover:cursor-pointer absolute right-2 top-2 w-8 flex justify-center py-1"
      >
        <BiDotsVertical className=" text-lg" />
      </button>

      <div
        // href={`/entry/${studentId}`}
        className={` flex flex-col items-center justify-center ${!isProxy && "h-full"} w-full px-4 py-5 rounded-md  gap-2`}
      >
        {image && (
          <div className="relative h-18 w-18 rounded-full overflow-hidden">
            <Image src={image} alt="user photo" fill />
          </div>
        )}
        {!image && <FaUserCircle className="text-5xl text-amber-950" />}
        <div className="font-semibold wrap-break-word text-stone-800 tracking-wider text-xs text-center">
          <p className="font-bold">ITS - {name.split(" ")[0]}</p>
          <p className="wrap-break-word font-normal text-[0.65rem] mt-1">
            {formattedName}
          </p>
        </div>
        <div className="w-full border-t border-(--border) py-2 text-[0.55rem]">
          <div className=" flex items-center gap-3 w-full ">
            <div>
              <LuGraduationCap className="text-xl text-(--primary)" />
            </div>
            <div className="truncate">
              <p className="text-(--text-muted) text-[0.70rem]">Teacher</p>
              <p className="text-(--text) truncate">
                {teacherName?.split(" ").slice(1).join(" ") ||
                  "no teacher assigned"}
              </p>
            </div>
          </div>
          <div className=" border-t border-(--border) py-2 mt-2 flex items-center gap-3">
            <div>
              <FaRegUser className="text-xl text-(--primary)" />
            </div>
            <div className="w-full truncate">
              <p className="text-(--text-muted) text-[0.70rem]">Proxy</p>
              <p className="text-(--text) truncate">
                {proxyTeacherName?.split(" ").slice(1).join(" ") ||
                  "no current proxy"}
              </p>
            </div>
          </div>

          <div className=" border-t border-(--border) py-2 mt-2 flex items-center gap-3">
            <div>
              <FaRegUser className="text-xl text-(--primary)" />
            </div>
            <div className="w-full truncate">
              <p className="text-(--text-muted) text-[0.70rem]">
                Recording duration
              </p>
              <p className="text-(--text) truncate">{classDuration} min</p>
            </div>
          </div>

          <div className=" border-t border-(--border) py-2 flex items-center gap-3">
            <div>
              <SiGoogleclassroom className="text-xl text-(--primary)" />
            </div>
            <div className="w-full truncate">
              <p className="text-(--text-muted) text-[0.70rem]">Class status</p>
              <h1 className="text-(--text-muted) text-[0.70rem] flex items-center gap-1">
                <p
                  className={`p-1 h-0 w-0 rounded-full ${classStatus === "pending" ? "bg-red-500" : "bg-green-500"}`}
                ></p>{" "}
                <span
                  className={`${classStatus === "pending" ? "text-red-500" : "text-green-500"}`}
                >
                  {classStatus === "pending" ? "Not recorded" : "Recorded"}
                </span>
              </h1>
            </div>
          </div>
        </div>
        <Link
          href={`/entry/${studentId}?studentName=${name}`}
          className=" rounded-lg flex items-center shadow justify-center gap-2 w-full shadow-m p-2 bg-(--primary-soft)/15 text-(--text) text-sm"
        >
          <div className="p-2 bg-(image:--gradient-soft) text-white rounded-full">
            <FaMicrophone className="" />
          </div>
          <p>Record</p>
        </Link>
      </div>
    </div>
  );
}

export default StudentCard
