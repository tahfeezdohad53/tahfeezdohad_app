'use client';
import Image from "next/image";
import Link from "next/link";
import { BiDotsVertical } from "react-icons/bi";
import { CiUser } from "react-icons/ci";
import { FaMicrophone, FaRegUser, FaUser, FaUserCircle } from "react-icons/fa";
import { LiaGraduationCapSolid } from "react-icons/lia";
import { LuGraduationCap } from "react-icons/lu";

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
  selectedStudents
}) {
  const isProxy = proxyTeacherId === teacherId;

  function handleSelectedStudent(e){
    if(!e.target.checked){
      setSelectedStudents(arr => arr.filter(el => el !== studentId));
    }else{
      setSelectedStudents(arr => [...arr,studentId]);
    }
  }
  return (
    <div className="py relative rounded-md w-full  border-amber-900 bg-(--card) shadow-(--shadow-xl) ">
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
      {!isProxy && (
        <button
          data-studentid={studentId}
          data-studentname={name}
          data-teachername={teacherName}
          data-proxyteachername={proxyTeacherName}
          className="menu-btn absolute right-2 top-2 w-8 flex justify-center py-1"
        >
          <BiDotsVertical className=" text-lg" />
        </button>
      )}
      <div
        // href={`/entry/${studentId}`}
        className={` flex flex-col items-center justify-center ${!isProxy && "h-full"} w-full px-4 py-7 rounded-md  gap-4`}
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
        <div className="w-full border-t border-(--border) py-2 text-[0.55rem]">
          <div className=" flex items-center gap-3">
            <LuGraduationCap className="text-xl text-(--primary)" />
            <div className="w-full">
              <p className="text-(--text-muted) text-[0.70rem]">Teacher</p>
              <p className="text-(--text) truncate">{teacherName}</p>
            </div>
          </div>
          <div className=" border-t border-(--border) py-2 mt-2 flex items-center gap-3">
            <FaRegUser className="text-xl text-(--primary)" />
            <div className="w-full">
              <p className="text-(--text-muted) text-[0.70rem]">Proxy</p>
              <p className="text-(--text) truncate">{proxyTeacherName || 'no current proxy'}</p>
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
