"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import StudentCard from "./StudentCard";
import axios from "axios";
import ContextMenu from "../ContextMenu";
import { Item, Separator, useContextMenu } from "react-contexify";
import { FaBook, FaBookOpen, FaEdit, FaGraduationCap, FaPlus, FaRegLightbulb, FaUserCircle, FaUserShield } from "react-icons/fa";
import { MdCheckBoxOutlineBlank, MdDelete } from "react-icons/md";
import CustomSelect from "../Select";
import Modal from "../Modal";
import { useAppProvider } from "../providers/AppProvider";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import StudentsFilter from "./StudentsFilter";
import { IoIosCheckboxOutline } from "react-icons/io";
import { PiDotsThreeVertical, PiDotsThreeVerticalBold } from "react-icons/pi";
import { useUser } from "../providers/UserProvider";
import CustomContextMenu from "../CustomContextMenu";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { HiOutlineSearch, HiOutlineChevronRight } from "react-icons/hi";

// import {  FaRegLightbulb } from "react-icons/fa";
import {
  FaUser,
  FaUserCheck,
  FaChalkboardTeacher,
  FaShieldAlt,
} from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
const recentStudents = [
  "Ahmed Khan",
  "Muhammad Ali",
  "Zainab Fatima",
];
function StudentsContainer() {
  const { user,isFetching } = useUser();
  const { teachers } = useAppProvider();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const { show } = useContextMenu({
    id: "student",
  });
  const router = useRouter();
  
  const [modal, setModal] = useState({ show: false, type: "" });
  const [showCustomeContextMenu,setShowCustomContextMenu] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState({
    name: "",
    id: "",
    teacher: "",
    proxyTeacher: "",
  });
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  function showContextMenu(e) {
    const target = e.target.closest(".menu-btn");
    if (!target) return;
    const { studentid, studentname, teachername, proxyteachername } =
      target.dataset;
    setSelectedStudent({
      name: studentname,
      id: studentid,
      teacher: teachername,
      proxyTeacher: proxyteachername,
    });
    show({ event: e });
  }

  async function handleChangeDiary(teacherId) {
    try {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_URL}/student/changeDiary?studentId=${selectedStudent.id}&teacherId=${teacherId}`,
        {},
        { withCredentials: true },
      );
      if (res.data.ok) {
                queryClient.invalidateQueries({ queryKey: ["myStudents"] });

        setModal({ show: false, type: "" });
        return toast.success("student diary updated");
      }
    } catch (err) {
      console.log(err);
      toast.error("failed to change student diary");
    }
  }
  async function handleAssignProxy(teacherId) {
    try {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_URL}/student/assignProxy?studentId=${selectedStudent.id}&teacherId=${teacherId}`,
        {},
        { withCredentials: true },
      );
      if (res.data.ok) {
        queryClient.invalidateQueries({queryKey:  ["myStudents"]});
        setModal({ show: false, type: "" });
        return toast.success("proxy assigned");
      }
    } catch (err) {
      console.log(err);
      if (!err.response.data.ok) return toast.error(err.response.data.message);
      toast.error("failed to assign proxy");
    }
  }
  const { data: students } = useQuery({
    queryKey: ["myStudents",user?.role,searchParams.get('batch')],
    queryFn: handleGetMyStudents,
    refetchOnWindowFocus: false,
    enabled:(user?.role === 'teacher' || user?.role === 'admin')
  });

  async function handleGetMyStudents() {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/student/getStudents?batch=${searchParams.get('batch')}`,
        {
          withCredentials: true,
        },
      );
      setFilteredStudents(res.data.students);
      return res.data.students;
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  function handleSelectAll() {
    const allStudents = students.map((el) => el._id);
    setSelectedStudents(allStudents);
  }

  function handleCancelSelection() {
    setIsSelecting(false);
    setSelectedStudents([]);
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
      }
      
      // return el.filter(el => {
      //   const nameArr = el.name.split(" ");
      //   const firstName = nameArr[0];
      //   const lastName = nameArr[nameArr.length - 1];
      //   const queryArr = value.split(' ');
      //   if(queryArr.length > 1){
      //     return ((firstName.includes(queryArr[0]) && lastName.includes(queryArr[1])) || (firstName.includes(queryArr[1] && lastName.includes(queryArr[0]))));
      //   }
      //   return firstName.includes(value) || lastName.includes(value);
      // })
    })
    // setFilteredStudents((student) =>
    //   student.filter((el) => el.name.toLowerCase().includes(value.toLowerCase())),
    // );
  }
  async function handleChangeMultipleDiaries(teacherId){
    try{
      if(selectedStudents?.length < 1) return toast.error('please select students first');
      await axios.patch(`${process.env.NEXT_PUBLIC_URL}/student/changeMultipleDiaries`,{teacherId,studentsId:selectedStudents},{withCredentials:true})
      toast.success(`diary updated of ${selectedStudents.length} students`);
      setSelectedStudents([]);
      queryClient.invalidateQueries({queryKey:['myStudents']});
       setModal({ show: false, type: "" });
       setIsSelecting(false);
       setShowCustomContextMenu(false);
    }catch(err){
      console.log(err);
    }
  }
  async function handleAssignMultipleProxies(teacherId){
    try{
      if(selectedStudents?.length < 1) return toast.error('please select students first');
      await axios.patch(`${process.env.NEXT_PUBLIC_URL}/student/assignMultipleProxies`,{teacherId,studentsId:selectedStudents},{withCredentials:true})
      toast.success(`diary updated of ${selectedStudents.length} students`);
      setSelectedStudents([]);
      queryClient.invalidateQueries({queryKey:['myStudents']});
       setModal({ show: false, type: "" });
       setIsSelecting(false);
       setShowCustomContextMenu(false);
    }catch(err){
      console.log(err);
    }
  }
  const session = useSession();
  useEffect(() => {
    if(session.status === "loading") return;
    if(isFetching) return;
    if(user?.role === 'student') router.replace('/gurfah');
    if(!user?._id) {
      router.replace("/auth");
    }
    
  },[user?.role,session?.status,isFetching])

  // if (!user?.role) {
  //   return(
  //     <div className="absolute top-1/2 left-1/2 -translate-1/2 w-full flex-col gap-3 flex items-center justify-center ">
  //       <h1>You are not authorized, please login</h1>
  //       <Link href={'/auth'} className="bg-(image:--gradient-primary) text-white rounded-md p-1 px-4">Login</Link>
  //     </div>
  //   )
  // };
  if(!user?._id || user?.role === 'student') return null;
  const customizedTeachers = teachers?.map((el) => ({
    label: el.name,
    value: el._id,
  }));
  return (
    <div className="">
      <div className="mb-10 bg-(image:--gradient-primary) mt-2 rounded-xl p-5 flex items-center gap-5 w-full ">
        <div className="p-3 text-white bg-(--primary-light) rounded-lg">
          <FaBook className="text-2xl lg:4xl" />
        </div>
        <div>
          <p className="text-white">
            {user.name
              .split(" ")
              .slice(1, user.name.split(" ").length)
              .join(" ")}
            &apos;s diary
          </p>
          <p className="text-white/80 text-xs">record and manage students</p>
        </div>
      </div>
      <StudentsFilter handleFilterStudents={handleFilterStudents} />
      <RecordWithNumberCard />
      {!isSelecting && students?.length > 0 && (
        <button
          onClick={() => setIsSelecting(true)}
          className="mt-5 bg-(image:--gradient-primary) hover:cursor-pointer duration-300 ease-in-out transition-all hover:scale-105 text-white/90 text-sm px-6 py-2 rounded-lg shadow-(--shadow-lg) ml-auto flex items-center gap-2"
        >
          <IoIosCheckboxOutline className="" /> Select
        </button>
      )}
      {isSelecting && (
        <div className="relative w-full flex items-center justify-between mt-5 bg-(--card) shadow-(--shadow-md) rounded-md py-2 px-4">
          <p className="text-sm font-bold tracking-wider">
            {selectedStudents.length} selected
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCancelSelection}
              className="shadow-(--shadow-lg) duration-300 ease-in-out transition-all hover:scale-105 hover:cursor-pointer border border-(--primary)/50 text-sm rounded-lg bg-(--bg-tertiary)/50 py-2 px-3"
            >
              cancel
            </button>
            <button
              onClick={handleSelectAll}
              className=" bg-(image:--gradient-primary) duration-300 ease-in-out transition-all hover:scale-105 hover:cursor-pointer text-white/90 text-sm px-6 py-2 rounded-lg shadow-(--shadow-lg) ml-auto flex items-center gap-2"
            >
              Select All
            </button>
            <button
              onClick={() => setShowCustomContextMenu(!showCustomeContextMenu)}
              className="hover:bg-gray-200/60 p-2 hover:cursor-pointer duration-300 transition-all ease-in-out"
            >
              <PiDotsThreeVerticalBold />
            </button>
            {showCustomeContextMenu && (
              <CustomContextMenu
                onClose={() => setShowCustomContextMenu(false)}
                options={[
                  {
                    text: "change diary",
                    icon: <FaBook className="text-(--primary)"/>,
                    handler: () =>
                      setModal({ type: "multiple-diary", show: true }),
                  },
                  {
                    text: "assign proxy",
                    icon: <FaBook className="text-(--primary)"/>,
                    handler: () =>
                      setModal({ type: "multiple-proxy", show: true }),
                  },
                ]}
              />
            )}
            {modal.show && modal.type === "multiple-diary" && (
              <Modal
                onClose={() => setModal({ show: false, type: "" })}
                className="w-[90%] h-fit rounded-3xl"
                headingStyles="text-xl font-bold text-center"
              >
                <div className="space-y-6 mt-6">
                  <div className="flex flex-col items-center">
                    {/* Icon Circle */}
                    <div className="p-4 rounded-full bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center shadow-sm border border-amber-100">
                      <FaBookOpen className="text-3xl text-amber-700" />
                    </div>

                    {/* Heading */}
                    <h2 className="mt-5 lg:text-2xl font-bold text-[var(--text-primary)] text-center">
                      Select teacher to change diaries
                    </h2>

                    {/* Decorative Line */}
                    <div className="flex items-center gap-2 mt-4">
                      <div className="w-10 h-[2px] bg-amber-300 rounded-full" />
                      <div className="w-2 h-2 rounded-full bg-amber-600" />
                      <div className="w-10 h-[2px] bg-amber-300 rounded-full" />
                    </div>
                  </div>
                  {/* Summary Card */}
                  <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm p-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                      <FaUsers className="text-amber-700 text-lg" />
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">
                        Selected Students
                      </p>
                      <p className="text-lg font-bold text-gray-800">
                        {selectedStudents.length}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      Select new teacher
                    </label>

                    <CustomSelect
                      options={customizedTeachers}
                      isButton
                      handler={handleChangeMultipleDiaries}
                    />
                  </div>

                  <div className="flex flex-col items-center text-center gap-2 text-xs text-gray-500">
                    <span>
                      This will update the teacher diary for all selected
                      students.
                    </span>
                    {/* <FaShieldAlt className="text-green-600" /> */}
                  </div>
                </div>
              </Modal>
            )}

            {modal.show && modal.type === "multiple-proxy" && (
              <Modal
                onClose={() => setModal({ show: false, type: "" })}
                className="w-[90%] h-fit rounded-3xl"
                headingStyles="text-xl font-bold text-center"
              >
                <div className="space-y-6 mt-6">
                  {/* Summary Card */}
                  <div className="flex flex-col items-center">
                    {/* Icon Circle */}
                    <div className="p-4 rounded-full bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center shadow-sm border border-amber-100">
                      <FaBookOpen className="text-3xl text-amber-700" />
                    </div>

                    {/* Heading */}
                    <h2 className="mt-5 lg:text-2xl font-bold text-[var(--text-primary)] text-center">
                      Select teacher to assign proxies
                    </h2>

                    {/* Decorative Line */}
                    <div className="flex items-center gap-2 mt-4">
                      <div className="w-10 h-[2px] bg-amber-300 rounded-full" />
                      <div className="w-2 h-2 rounded-full bg-amber-600" />
                      <div className="w-10 h-[2px] bg-amber-300 rounded-full" />
                    </div>
                  </div>
                  <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm p-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                      <FaUsers className="text-amber-700 text-lg" />
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">
                        Selected Students
                      </p>
                      <p className="text-lg font-bold text-gray-800">
                        {selectedStudents.length}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      Select proxy teacher
                    </label>

                    <CustomSelect
                      options={customizedTeachers}
                      isButton
                      handler={handleAssignMultipleProxies}
                    />
                  </div>

                  <div className="flex items-center flex-col text-center gap-2 text-xs text-gray-500">
                    <span>
                      This will assign the selected teacher as proxy for all
                      selected students.
                    </span>
                    {/* <FaShieldAlt className="text-green-600" /> */}
                  </div>
                </div>
              </Modal>
            )}
          </div>
        </div>
      )}
      <div
        onClick={showContextMenu}
        className=" grid grid-cols-2 lg:flex lg:flex-wrap lg:justify-center gap-y-6 gap-x-5 mt-5"
      >
        {filteredStudents?.map((el) => (
          <StudentCard
            key={el._id}
            image={el?.profileImage}
            name={el.name}
            studentId={el._id}
            proxyTeacherId={el.proxyTeacher?._id}
            teacherId={user._id}
            teacherName={el?.teacher?.name}
            proxyTeacherName={el?.proxyTeacher?.name}
            isSelecting={isSelecting}
            selectedStudents={selectedStudents}
            setSelectedStudents={setSelectedStudents}
          />
        ))}
        {/* {students?.length < 1 && (
          <h1 className="absolute top-1/2 left-1/2 -translate-1/2 font-bold text-xl tracking-wider text-center w-3/4">
            you don&apos;t have any students tagged yet!
          </h1>
        )} */}
        {modal.show && (modal.type === "diary" || modal.type === "proxy") && (
          <Modal
            onClose={() => setModal({ show: false, type: "" })}
            className="w-[90%] h-fit rounded-3xl"
            headingStyles="text-xl font-bold text-center"
            // heading={
            //   modal.type === "diary"
            //     ? "Select teacher to change diary"
            //     : "Select teacher to assign proxy"
            // }
          >
            <div className="space-y-6">
              <div className="flex flex-col items-center">
                {/* Icon Circle */}
                <div className="p-4 rounded-full bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center shadow-sm border border-amber-100">
                  {modal.type === "diary" ? (
                    <FaBookOpen className="text-3xl text-amber-700" />
                  ) : (
                    <FaUserShield className="text-3xl text-amber-700" />
                  )}
                </div>

                {/* Heading */}
                <h2 className="mt-5 lg:text-2xl font-bold text-[var(--text-primary)] text-center">
                  {modal.type === "diary"
                    ? "Select teacher to change diary"
                    : "Select teacher to assign proxy"}
                </h2>

                {/* Decorative Line */}
                <div className="flex items-center gap-2 mt-4">
                  <div className="w-10 h-[2px] bg-amber-300 rounded-full" />
                  <div className="w-2 h-2 rounded-full bg-amber-600" />
                  <div className="w-10 h-[2px] bg-amber-300 rounded-full" />
                </div>
              </div>
              {/* Student & Teacher Card */}
              <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
                {/* Student */}
                <div className="flex gap-3 p-4">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-amber-100 flex items-center justify-center">
                      <FaUser className="text-amber-700 text-lg" />
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase">
                      Student
                    </p>
                    <p className="text-xs lg:text-sm mt-1 font-semibold text-gray-800">
                      {selectedStudent.name}
                    </p>
                  </div>
                </div>

                <div className="border-t border-neutral-200" />

                {/* Current Teacher */}
                <div className="flex gap-3 p-4">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-amber-100 flex items-center justify-center">
                      <FaChalkboardTeacher className="text-amber-700 text-lg" />
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase">
                      Current Teacher
                    </p>
                    <p className="text-xs lg:text-sm mt-1 font-semibold text-gray-800">
                      {selectedStudent.teacher || "No Teacher Assigned"}
                    </p>
                  </div>
                </div>

                {selectedStudent.proxyTeacher && (
                  <>
                    <div className="border-t border-neutral-200" />

                    <div className="flex gap-3 p-4">
                      <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 flex items-center justify-center">
                          <FaUserCheck className="text-green-700 text-lg" />
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase">
                          Current Proxy
                        </p>
                        <p className="text-xs lg:text-sm mt-1 font-semibold text-gray-800">
                          {selectedStudent.proxyTeacher}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Select */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  {modal.type === "diary"
                    ? "Select new teacher"
                    : "Select proxy teacher"}
                </label>

                <CustomSelect
                  options={customizedTeachers}
                  isButton
                  handler={
                    modal.type === "diary"
                      ? handleChangeDiary
                      : handleAssignProxy
                  }
                />
              </div>

              {/* Footer Note */}
              <div className="flex items-center gap-2 text-xs justify-center text-gray-500">
                <FaShieldAlt className="text-green-600" />
                <span>
                  {modal.type === "diary"
                    ? "This will update the diary teacher."
                    : "This will assign a proxy teacher."}
                </span>
              </div>
            </div>
          </Modal>
        )}
        <ContextMenu>
          
            <Item onClick={() => setModal({ show: true, type: "diary" })}>
              <FaEdit className="mr-2" /> change diary
            </Item>
          
          <Separator />

          <Item onClick={() => setModal({ show: true, type: "proxy" })}>
            <FaEdit className="mr-2" /> assign proxy
          </Item>
          {user.role === "admin" && <Separator />}
          {user.role === "admin" && (
            <Item onClick={() => console.log("Delete")}>
              <MdDelete className="mr-2" /> delete student
            </Item>
          )}
        </ContextMenu>
      </div>
    </div>
  );
}

export default StudentsContainer;

import { HiOutlineUserAdd } from "react-icons/hi";

export function RecordWithNumberCard({page='entry',userType="teacher"}) {
  const [showSelector,setShowSelector] = useState(false);
  const {students,teachers} = useAppProvider();
  const router = useRouter();
  let recentStudents; 
  try{
    recentStudents = JSON.parse(localStorage.getItem('recentStudents'))||[];
  }catch{
    localStorage.removeItem('recentStudents');
    recentStudents = [];
  }
  // alert(typeof recentStudents);
  let formatedStudents;
  let formattedTeachers;
  if(userType === 'teacher') {
    formatedStudents = students?.map((el) => {
      return { label: el.name, value: el._id };
    });
  }
  if(userType === 'student') {
    formattedTeachers = teachers?.map((el) => {
      return { label: el.name, value: el._id };
    });
  }
  function handleSelect({value:id,label:studentName}){
    if(recentStudents?.length === 3){
      recentStudents.pop();
      recentStudents.unshift({name:studentName,id});
      localStorage.setItem('recentStudents',JSON.stringify(recentStudents));
    }
    if(recentStudents?.length > 0 && recentStudents?.length < 3){
      
      recentStudents.unshift({name:studentName,id});
      localStorage.setItem('recentStudents',JSON.stringify(recentStudents));
    }
    if(recentStudents?.length === 0){
      const newArr = [];
      newArr.unshift({name:studentName,id});
      // alert(JSON.stringify(newArr))
      localStorage.setItem('recentStudents',JSON.stringify(newArr));
    }
    if(page === 'entry')router.replace(`/entry/${id}?studentName=${studentName}`);
    if(page === 'gurfah')router.replace(`/onlineclass/${id}`);
  }
  return (
    <div className="mb-5 mt-2 flex items-center justify-between rounded-3xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
      <div className="flex w-[72%] items-center gap-4">
        <div>
          <div className="flex p-3 items-center justify-center rounded-full bg-amber-100">
            <HiOutlineUserAdd className="text-amber-700 text-xl" />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-amber-950">
            {userType === 'teacher' ? 'Student' : 'Teacher'} not tagged?
          </h3>

          {userType === 'teacher' && <p className="mt-1 font-semibold text-xs leading-5 text-amber-800/80">
            Student not in your diary? select from here.
          </p>}
          {userType === 'student' && <p className="mt-1 text-xs leading-5 text-amber-800/80">
             select teacher from here.
          </p>}
        </div>
      </div>

      <button
        onClick={() => setShowSelector(true)}
        className="flex items-center hover:cursor-pointer duration-300 ease-in-out transition-all gap-2 rounded-xl bg-amber-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-800 active:scale-95"
      >
        <HiOutlineUserAdd size={18} />
        
      </button>

      {showSelector && (
        <Modal
          onClose={() => setShowSelector(false)}
          className="w-[90%] max-w-md h-fit rounded-[30px] border border-amber-100 bg-[#FFFBF7]"
        >
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center gap-4">
              <div className="flex p-3 items-center justify-center rounded-full bg-amber-100">
                <FaGraduationCap className="text-3xl text-amber-700" />
              </div>

              <div>
                <h2 className="lg:text-2xl text-lg font-bold text-amber-950">
                  Select {userType === 'teacher' ? 'Student' : 'Teacher'}
                </h2>

                <p className="mt-1 text-gray-500 text-xs lg:text-sm">
                  Choose a {userType === 'teacher' ? 'student' : 'teacher'} from the list
                </p>
              </div>
            </div>

            {/* Select */}
            <CustomSelect
              options={userType === 'teacher' ? formatedStudents : formattedTeachers}
              handler={handleSelect}
              handleOnChange
            />

            {/* Recent */}
            {userType === 'teacher' && <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="font-semibold text-amber-950">Recent</span>

                <div className="h-px flex-1 bg-gray-200" />
              </div>

              <div className="space-y-3">
                {recentStudents?.map((student) => (
                  <div key={student?.id}>
                    <Link
                      href={page === 'entry' ? `/entry/${student?.id}?studentName=${student?.name}` : `/onlineclass/${student?.id}`}
                      className="flex w-full items-center justify-between rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm transition hover:border-amber-200 hover:shadow-md"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex p-2 items-center justify-cente rounded-full bg-amber-50">
                          <FaUserCircle className="text-2xl text-amber-300" />
                        </div>

                        <span className="text-xs text-left text-gray-800">
                          {student?.name.split(" ").slice(1).join(" ")}
                        </span>
                      </div>

                      <HiOutlineChevronRight className="text-xl text-amber-700" />
                    </Link>
                  </div>
                ))}
                {!recentStudents?.length && (
                  <p className="text-center my-10">
                    No recent students selected!
                  </p>
                )}
              </div>
            </div>}

            {/* Footer */}
            <div className="flex items-start gap-4 rounded-2xl border border-amber-100 bg-amber-50 p-4">
              <div className="flex p-3 items-center justify-center rounded-full bg-amber-100">
                <FaRegLightbulb className="text-xl text-amber-700" />
              </div>

              <div>
                <p className="font-semibold text-amber-900 text-sm">
                  Can't find the {userType === 'teacher' ?  'student' : 'teacher'}?
                </p>

                <p className="mt-1 text-sm text-gray-500 ">
                  Search with name , ITS or lastname
                </p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
