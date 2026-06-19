'use client';

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import StudentsFilter from "../students/StudentsFilter";
import { FaUser } from "react-icons/fa";
import { RiArrowDropRightLine } from "react-icons/ri";
import Link from "next/link";
import { useUser } from "../providers/UserProvider";
import { ImSpinner2 } from "react-icons/im";
import ScrollToTopButton from "../ScrollToTopButton";
import { useSearchParams } from "next/navigation";

function StudentContainer() {
  const {user} = useUser();
  const searchParams = useSearchParams();
  
    const [filteredStudents,setFilteredStudents] = useState([]);
          const { data: students } = useQuery({
            queryKey: ["myStudents",searchParams.get('batch')],
            queryFn: handleGetUser,
            refetchOnWindowFocus: false,
            enabled:!!user?.role && user?.role !== 'student',
          });
          const { data: teachers } = useQuery({
            queryKey: ["myTeachers"],
            queryFn: handleGetUser,
            refetchOnWindowFocus: false,
            enabled:!!user?.role && user?.role === 'student',
          });
          useEffect(() => {
            setFilteredStudents(students ?? []);
          }, [students]);

          async function handleGetUser() {
            try {
             if(user?.role !== 'student'){
               const res = await axios.get(
                 `${process.env.NEXT_PUBLIC_URL}/student/getStudents?batch=${searchParams.get('batch')}`,
                 {
                   withCredentials: true,
                 },
               );
               setFilteredStudents(res.data.students);
               return res.data.students;
             }else{
               const res = await axios.get(
                 `${process.env.NEXT_PUBLIC_URL}/teacher/getMyTeachers`,
                 {
                   withCredentials: true,
                 },
               );
               console.log(res.data)
               return res.data.teachers;
             }
            } catch (err) {
              console.log(err);
              return [];
            }
          }

          function handleFilterStudents(value) {
            if (value.length < 3) return setFilteredStudents(students);
            setFilteredStudents(students);
            setFilteredStudents((student) =>
              student.filter((el) => el.name.toLowerCase().includes(value.toLowerCase())),
            );
          }
          // if(isLoadingTeacher || isLoadingStudents) return <div><ImSpinner2 className="animate-spin absolute top-1/2 left-1/2 -translate-1/2"/></div>;
    return (
      <div className="flex flex-col min-w-full  max-h-full ">
        {user?.role !== "student" && (
          <StudentsFilter handleFilterStudents={handleFilterStudents} />
        )}
        <ScrollToTopButton />
        <div className=" ">
          <div className="mt-5 flex flex-col lg:grid grid-cols-2 gap-3 w-full ">
            {/* <div className="bg-(--card) flex-1 mt-5 rounded-lg shadow-(--shadow-lg)"> */}
            {(user?.role === "teacher" || user?.role === 'admin') &&
              filteredStudents?.length > 0 &&
              filteredStudents.map((el) => (
                <StudentCard key={el._id} name={el.name} id={el._id} status={el.status}/>
              ))}

            {user?.role === "student" &&
              teachers?.length > 0 &&
              teachers.map((el) => (
                <StudentCard key={el._id} name={el.name} id={el._id} status={el.status}/>
              ))}
            {students?.length < 1 && (
              <h1 className="absolute top-1/2 left-1/2 -translate-1/2 font-bold text-xl tracking-wider text-center w-3/4">
                you don&apos;t have any students tagged yet!
              </h1>
            )}
          </div>
        </div>
      </div>
    );
}
export default StudentContainer

function StudentCard({name,id,status}){
    return (
      <Link href={`/onlineclass/${id}`} className="bg-(--card) shadow-(--shadow-sm) border-l-6 border-l-(--primary) flex items-center justify-between p-5 border rounded-tl-lg rounded-bl-lg rounded-tr-xl rounded-br-xl border-(--border) duration-300 ease-in-out transition-all hover:cursor-pointer hover:bg-(--card-hover)">
        <div className="flex items-center gap-6">
          <div className="p-3 rounded-full bg-(--bg-tertiary)/50">
            <FaUser className="text-xl" />
          </div>
          <div className="font-bold text-(--text) tracking-wider">{name} <p className={`text-[0.60rem] ${status==='offline'?'text-red-500/70':'text-green-500/70'}`}>{status}</p></div>
        </div>
        <div className="p-1 rounded-full bg-(--bg-tertiary)/50"><RiArrowDropRightLine className="text-2xl" /></div>
      </Link>
    );
}