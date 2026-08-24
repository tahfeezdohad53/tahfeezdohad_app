'use client';
import { formatName } from "@/helpers";
import Image from "next/image";
import Link from "next/link";
import { BiDotsVertical } from "react-icons/bi";
import { CiTimer, CiUser } from "react-icons/ci";
import { FaMicrophone, FaRegUser, FaUser, FaUserCircle } from "react-icons/fa";
import { FaCheckToSlot } from "react-icons/fa6";
import { IoTimerOutline } from "react-icons/io5";
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
  role,
  slots=[],
  batch,
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
    <div className="py relative rounded-md w-full lg:w-[18%]  border-amber-900 bg-(--card) shadow-(--shadow-xl) ">
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
          {role === "admin" && (
            <>
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
            </>
          )}

          <div
            className={`border-b border-(--border) py-2  flex items-center gap-3`}
          >
            <div>
              <FaCheckToSlot className="text-xl text-(--primary)" />
            </div>
            <div className="w-full">
              <p className="text-(--text-muted) text-[0.70rem]">
                Slots
              </p>
              <div className="flex items-center gap-1 w-full flex-wrap">
                <p className={`${slots.includes('jd') ? "text-green-500" : "text-red-500"}`}>Jd,</p>
                <p className={`${slots.includes('mj') || slots.includes("jz-mj") ? "text-green-500" : "text-red-500"}`}>Mj,</p>
                <p className={`${slots.includes('jz') || slots.includes("jz-mj") ? "text-green-500" : "text-red-500"}`}>Jz,</p>
                <p className={`${slots.includes('t1') ? "text-green-500" : "text-red-500"}`}>T1,</p>
                <p className={`${slots.includes('t2') ? "text-green-500" : "text-red-500"}`}>T2,</p>
                {batch.includes('yaqoot') && <p className={`${slots.includes('t3') ? "text-green-500" : "text-red-500"}`}>T3,</p>}
                {batch.includes('yaqoot') && <p className={`${slots.includes('t4') ? "text-green-500" : "text-red-500"}`}>T4,</p>}
                {batch.includes('yaqoot') && <p className={`${slots.includes('t5') ? "text-green-500" : "text-red-500"}`}>T5</p>}
              </div>
            </div>
          </div>
          <div
            className={` ${role === "admin" && "border-t mt-2"} border-(--border) py-2  flex items-center gap-3`}
          >
            <div>
              <IoTimerOutline className="text-xl text-(--primary)" />
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
