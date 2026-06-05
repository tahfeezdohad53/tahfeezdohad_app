'use client';

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import StudentsFilter from "../students/StudentsFilter";
import { FaUser } from "react-icons/fa";
import { RiArrowDropRightLine } from "react-icons/ri";
import Link from "next/link";
import { useUser } from "../providers/UserProvider";

function StudentContainer() {
  const {user} = useUser();
  // useEffect(()=>{
  //   console.log(!!user?.role && user?.role !== 'student')
  // },[user])
    const [filteredStudents,setFilteredStudents] = useState([]);
          const { data: students } = useQuery({
            queryKey: ["myStudents",user?._id],
            queryFn: handleGetUser,
            refetchOnWindowFocus: false,
            // staleTime:10 * 60 * 1000,
            enabled:!!user?.role && user?.role !== 'student',
          });
          const { data: teachers } = useQuery({
            queryKey: ["myTeachers"],
            queryFn: handleGetUser,
            refetchOnWindowFocus: false,
            staleTime:Infinity,
            enabled:!!user?.role && user?.role === 'student',
          });

          async function handleGetUser() {
            try {
             if(user?.role !== 'student'){
               const res = await axios.get(
                 `${process.env.NEXT_PUBLIC_URL}/student/getStudents`,
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
              student.filter((el) => el.name.includes(value)),
            );
          }
    return (
      <div className="h-full min-w-full flex flex-col">
        {user?.role !== 'student' && <StudentsFilter handleFilterStudents={handleFilterStudents} />}
        <div className="mt-5 flex flex-col gap-3 w-full h-full overflow-auto">
        {/* <div className="bg-(--card) flex-1 mt-5 rounded-lg shadow-(--shadow-lg)"> */}
          {user?.role !== 'student' && filteredStudents?.length > 0 &&
            filteredStudents.map((el) => (
             <StudentCard key={el._id} name={el.name} id={el._id}/>
            ))}
          
          {user?.role === 'student' && teachers?.length > 0 &&
            teachers.map((el) => (
             <StudentCard key={el._id} name={el.name} id={el._id}/>
            ))}
          {students?.length < 1 && (
            <h1 className="absolute top-1/2 left-1/2 -translate-1/2 font-bold text-xl tracking-wider text-center w-3/4">
              you don&apos;t have any students tagged yet!
            </h1>
          )}
        </div>
      </div>
    );
}
export default StudentContainer

function StudentCard({name,id}){
    return (
      <Link href={`/onlineclass/${id}`} className="bg-(--card) shadow-(--shadow-sm) flex items-center justify-between p-5 border rounded-xl border-(--border) duration-300 ease-in-out transition-all hover:cursor-pointer hover:bg-(--card-hover)">
        <div className="flex items-center gap-6">
          <div className="p-3 rounded-full bg-(--bg-tertiary)/50">
            <FaUser className="text-xl" />
          </div>
          <div className="font-bold text-(--text) tracking-wider">{name}</div>
        </div>
        <div><RiArrowDropRightLine className="text-2xl" /></div>
      </Link>
    );
}