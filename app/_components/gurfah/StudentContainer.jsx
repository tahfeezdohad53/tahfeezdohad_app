"use client";

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
import { HiUserGroup } from "react-icons/hi2";
import { IoClose } from "react-icons/io5";
import { LuHeadphones } from "react-icons/lu";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { RecordWithNumberCard } from "../students/StudentsContainer";

function StudentContainer() {
  const { user, isFetching } = useUser();
  const session = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filteredStudents, setFilteredStudents] = useState([]);
  const { data: students } = useQuery({
    queryKey: ["myStudents", searchParams.get("batch")],
    queryFn: handleGetUser,
    refetchOnWindowFocus: false,
    refetchOnMount:false,
    placeholderData: keepPreviousData,
    enabled: !!user?.role && user?.role !== "student",
  });
  const { data: teachers } = useQuery({
    queryKey: ["myTeachers"],
    queryFn: handleGetUser,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    placeholderData: keepPreviousData,
    enabled: !!user?.role && user?.role === "student",
  });
  // useEffect(() => {
  //   setFilteredStudents(students ?? []);
  // }, [students]);

  async function handleGetUser() {
    try {
      if (user?.role !== "student") {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/student/getStudents?batch=${searchParams.get("batch")}`,
          {
            withCredentials: true,
          },
        );
        setFilteredStudents(res.data.students);
        return res.data.students;
      } else {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/teacher/getMyTeachers`,
          {
            withCredentials: true,
          },
        );
        // console.log(res.data);
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
    setFilteredStudents(el => {
      const isNumber = Number(value);
      if(isNumber){
        return el.filter((el) => {
          return el.name.includes(value);
        });
      }else{
        return el.filter(el => {
          const nameArr = el.name.split(" ");
          const firstName = nameArr[1];
          const lastName = nameArr[nameArr.length - 1];
          const queryArr = value.toLowerCase().split(' ');
          if(queryArr.length > 1){
            return ((firstName.includes(queryArr[0]) && lastName.includes(queryArr[1])) || (firstName.includes(queryArr[1] && lastName.includes(queryArr[0]))));
          }
          return firstName.includes(value.toLowerCase()) || lastName.includes(value.toLowerCase());
        })
      }})}
      function resetFilteredStudents(){
        setFilteredStudents(students);
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
    <div className="flex flex-col min-w-full max-h-full ">
      {(user?.role === "teacher" || user?.role === 'admin') && (
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
      {user?.role === "teacher" && students?.length > 0  && (
        <StudentsFilter reset={resetFilteredStudents} handleFilterStudents={handleFilterStudents} />
      )}
      {user?.role === "admin" && (
        <StudentsFilter reset={resetFilteredStudents} handleFilterStudents={handleFilterStudents} />
      )}

      <RecordWithNumberCard page="gurfah"/>
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

        {user?.role === "student" && teachers?.length < 1 && (
          <NoTeacherAssigned />
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
        </div>
          {students?.length < 1 && user?.role === "teacher" && (
            
              <NoStudentsAssigned />
            
          )}
      </div>
    </div>
  );
}
export default StudentContainer;

function StudentCard({ name, id, status, profileImage }) {
  let formattedName;
  const nameArr = name.split(" ");

  const firstName = nameArr[1];
  const lastName = nameArr[nameArr.length - 1];
  formattedName = firstName.concat(` ${lastName}`);
  return (
    <Link
      href={`/onlineclass/${id}`}
      className="bg-(--card) shadow-(--shadow-sm) flex items-center justify-between px-5 py-3 border rounded-tl-lg rounded-bl-lg rounded-tr-xl rounded-br-xl border-gray-300 duration-300 ease-in-out transition-all hover:cursor-pointer hover:bg-(--card-hover)"
    >
      <div className="flex items-center gap-6">
        <div className=" min-h-13 min-w-13 flex justify-center items-center relative rounded-full bg-(--bg-tertiary)/50">
        <div className={`h-2 w-2 absolute right-1 top-1 rounded-full ${status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
          {!profileImage && (
            <div className="">
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

function NoTeacherAssigned() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12">
      {/* Illustration */}
      <div className="relative mb-8">
        {/* Outer Ring */}
        <div className="flex h-40 w-40 items-center justify-center rounded-full border border-dashed border-amber-200">
          {/* Inner Circle */}
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-b from-amber-50 to-white shadow-inner">
            <div className="relative">
              <HiUserGroup size={62} className="text-amber-800/70" />

              {/* X Badge */}
              <div className="absolute -bottom-1 left-1/2 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border-2 border-white bg-white shadow">
                <IoClose size={22} className="text-amber-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Decorative dots */}
        <div className="absolute left-3 top-6 h-2 w-2 rounded-full bg-amber-200" />
        <div className="absolute right-4 top-8 h-2 w-2 rounded-full bg-amber-200" />
        <div className="absolute left-0 bottom-10 h-1.5 w-1.5 rounded-full bg-amber-100" />
        <div className="absolute right-1 bottom-12 h-1.5 w-1.5 rounded-full bg-amber-100" />
      </div>

      {/* Heading */}
      <h2 className="max-w-xs text-center text-3xl font-bold text-neutral-900">
        No teacher is assigned to you.
      </h2>

      {/* Description */}
      <p className="mt-4 max-w-sm text-center text-base leading-7 text-neutral-500">
        You don't have a Muhafiz assigned yet.
        <br />
        Please contact the admin for assistance.
      </p>

      {/* Button */}
      {/* <button className="mt-8 flex items-center gap-3 rounded-2xl border border-amber-700 bg-white px-8 py-4 font-semibold text-amber-800 transition hover:bg-amber-50">
        <LuHeadphones size={22} />
        Contact Admin
      </button> */}
    </div>
  );
}

function NoStudentsAssigned(){
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12">
      {/* Icon */}
      <div className="relative mb-8">
        {/* Outer Circle */}
        <div className="flex h-40 w-40 items-center justify-center rounded-full border border-dashed border-amber-200">
          {/* Inner Circle */}
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-amber-50">
            <div className="relative">
              <HiOutlineClipboardDocumentList
                size={72}
                className="text-amber-700"
              />

              {/* Cross Badge */}
              <div className="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-amber-500 shadow-md">
                <IoClose size={22} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Decorative dots */}
        <div className="absolute left-2 top-6 h-2 w-2 rounded-full bg-amber-200" />
        <div className="absolute right-4 top-8 h-2 w-2 rounded-full bg-amber-200" />
        <div className="absolute left-6 bottom-8 h-1.5 w-1.5 rounded-full bg-amber-100" />
        <div className="absolute right-6 bottom-6 h-1.5 w-1.5 rounded-full bg-amber-100" />
      </div>

      {/* Text */}
      <h2 className="text-center text-3xl font-bold text-neutral-900">
        You don't have any
        <br />
        students tagged yet!
      </h2>

      <p className="mt-4 max-w-sm text-center text-base leading-7 text-neutral-500">
        Once students are tagged by your admin,
        <br />
        you'll see them here.
      </p>
    </div>
  );
}