'use client';

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import StudentsFilter from "../students/StudentsFilter";
import { FaGraduationCap, FaUser } from "react-icons/fa";
import { RiArrowDropRightLine } from "react-icons/ri";
import Link from "next/link";
import { useUser } from "../providers/UserProvider";
import { ImSpinner2 } from "react-icons/im";
import ScrollToTopButton from "../ScrollToTopButton";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";

function StudentContainer() {
  const {user,isFetching} = useUser();
  const session = useSession();
  const searchParams = useSearchParams();
      const router = useRouter();
  
  
    const [filteredStudents,setFilteredStudents] = useState([]);
          const { data: students } = useQuery({
            queryKey: ["myStudents",searchParams.get('batch')],
            queryFn: handleGetUser,
            refetchOnWindowFocus: false,
            placeholderData:keepPreviousData,
            enabled:!!user?.role && user?.role !== 'student',
          });
          const { data: teachers } = useQuery({
            queryKey: ["myTeachers"],
            queryFn: handleGetUser,
            refetchOnWindowFocus: false,
            placeholderData:keepPreviousData,
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
            if (value.length < 2) return setFilteredStudents(students);
            setFilteredStudents(students);
            setFilteredStudents((el) => {
              return el.filter((el) => {
                const nameArr = el.name.split(" ");
                const firstName = nameArr[0];
                const lastName = nameArr[nameArr.length - 1];
                const queryArr = value.split(" ");
                if (queryArr.length > 1) {
                  return (
                    (firstName.includes(queryArr[0]) &&
                      lastName.includes(queryArr[1])) ||
                    firstName.includes(
                      queryArr[1] && lastName.includes(queryArr[0]),
                    )
                  );
                }
                return firstName.includes(value) || lastName.includes(value);
              });
            });
          }
          useEffect(() => {
            if (session.status === "loading") return;
            if (isFetching) return;
            if (!user?._id) {
              router.replace("/auth");
            }
          }, [user?.role, session?.status, isFetching]);
          // if(isLoadingTeacher || isLoadingStudents) return <div><ImSpinner2 className="animate-spin absolute top-1/2 left-1/2 -translate-1/2"/></div>;
    return (
      <div className="flex flex-col min-w-full  max-h-full ">
        {user?.role === "teacher" && (
          <div className="mb-5 bg-(image:--gradient-primary) rounded-xl p-5 flex items-center gap-5 w-full ">
            <div className="p-3 text-white bg-(--primary-light) rounded-lg">
              <FaGraduationCap className="text-2xl lg:4xl" />
            </div>
            <div>
              <p className="text-white">Your Students</p>
              <p className="text-white/80 text-xs">
                Contact any of your student from here
              </p>
            </div>
          </div>
        )}
        {user?.role !== "student" && (
          <StudentsFilter handleFilterStudents={handleFilterStudents} />
        )}
        <ScrollToTopButton />

        <div className="h-full">
          {/* <div className=" text-sm">
            <p className="font-bold text-lg">Your Assigned Teacher &</p>
            <p className="text-xl font-bold"> Proxy Teacher</p>
          </div> */}
          {user?.role === "student" && (
            <div className="mb-5 bg-(image:--gradient-primary) rounded-xl p-5 flex items-center gap-5 w-full ">
              <div className="p-3 text-white bg-(--primary-light) rounded-lg">
                <FaGraduationCap className="text-2xl lg:4xl" />
              </div>
              <div>
                <p className="text-white">Your Muhaffiz</p>
                <p className="text-white/80 text-xs">
                  Contact your assigned Muhaffiz from here
                </p>
              </div>
            </div>
          )}
          <div className=" flex flex-col lg:grid grid-cols-2 gap-3 w-full ">
            {/* <div className="bg-(--card) flex-1 mt-5 rounded-lg shadow-(--shadow-lg)"> */}
            {(user?.role === "teacher" || user?.role === "admin") &&
              filteredStudents?.length > 0 &&
              filteredStudents.map((el) => (
                <StudentCard
                  profileImage={el?.profileImage}
                  key={el._id}
                  name={el.name}
                  id={el._id}
                  status={el.status}
                />
              ))}

            {user?.role === "student" &&
              teachers?.length > 0 &&
              teachers.map((el) => (
                <StudentCard
                  profileImage={el?.profileImage}
                  key={el._id}
                  name={el.name}
                  id={el._id}
                  status={el.status}
                />
              ))}
            {students?.length < 1 && user?.role === "teacher" && (
              <h1 className="absolute top-1/2 left-1/2 -translate-1/2 font-semibold text-sm tracking-wider text-center w-3/4">
                you don&apos;t have any students tagged yet!
              </h1>
            )}
          </div>
        </div>
      </div>
    );
}
export default StudentContainer

function StudentCard({name,id,status,profileImage}){
  let formattedName;
  const nameArr = name.split(" ");

  const firstName = nameArr[1];
  const lastName = nameArr[nameArr.length - 1];
  formattedName = firstName.concat(` ${lastName}`);
    return (
      <Link
        href={`/onlineclass/${id}`}
        className="bg-(--card) shadow-(--shadow-sm) border-l-6 border-l-(--primary) flex items-center justify-between px-5 py-3 border rounded-tl-lg rounded-bl-lg rounded-tr-xl rounded-br-xl border-(--border) duration-300 ease-in-out transition-all hover:cursor-pointer hover:bg-(--card-hover)"
      >
        <div className="flex items-center gap-6">
          <div className="min-h-13 min-w-13 overflow-hidden flex justify-center items-center relative rounded-full bg-(--bg-tertiary)/50">
            {!profileImage && (
              <div>
                <FaUser className="text-2xl" />
              </div>
            )}
            {profileImage && (
              <Image fill src={profileImage} alt="profile photo" />
            )}
          </div>
          <div className="font-semibold text-xs text-(--text) tracking-wider">
            {name.split(" ").slice(1, name.split(" ").length).join(" ")}{" "}
            <p
              className={`text-[0.60rem] ${status === "offline" ? "text-red-500/70" : "text-green-500/70"}`}
            >
              {status}
            </p>
          </div>
        </div>
        <div className="p-1 ml-12 rounded-full bg-(--bg-tertiary)/50">
          <RiArrowDropRightLine className="text-2xl" />
        </div>
      </Link>
    );
}