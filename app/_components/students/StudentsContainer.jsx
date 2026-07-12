"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import StudentCard from "./StudentCard";
import axios from "axios";
import ContextMenu from "../ContextMenu";
import { Item, Separator, useContextMenu } from "react-contexify";
import { FaBook, FaEdit, FaPlus } from "react-icons/fa";
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
      
      return el.filter(el => {
        const nameArr = el.name.split(" ");
        const firstName = nameArr[0];
        const lastName = nameArr[nameArr.length - 1];
        const queryArr = value.split(' ');
        if(queryArr.length > 1){
          return ((firstName.includes(queryArr[0]) && lastName.includes(queryArr[1])) || (firstName.includes(queryArr[1] && lastName.includes(queryArr[0]))));
        }
        return firstName.includes(value) || lastName.includes(value);
      })
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
  if(user?.role === 'student') return null;
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
          <p className="text-white">{user.name}&apos;s diary</p>
          <p className="text-white/80 text-xs">record and manage students</p>
        </div>
      </div>
      <StudentsFilter handleFilterStudents={handleFilterStudents} />
      <RecordWithNumberCard />
      {!isSelecting && (
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
              onClose={()=>setShowCustomContextMenu(false)}
                options={[
                  {
                    text: "change diary",
                    icon: <FaBook />,
                    handler: () =>
                      setModal({ type: "multiple-diary", show: true }),
                  },
                  {
                    text: "assign proxy",
                    icon: <FaBook />,
                    handler: () =>
                      setModal({ type: "multiple-proxy", show: true }),
                  },
                ]}
              />
            )}
            {modal.show && modal.type === "multiple-diary" && (
              <Modal
                onClose={() => setModal({ show: false, type: "" })}
                className="h-fit"
                headingStyles="text-sm decoration-0"
                heading="select teacher to change diaries"
              >
                <div className="mt-8 mb-4 space-y-2">
                  <h1 className="ml-1 tracking-wider font-semibold text-xs text-(--text-secondary)">
                    Students: {selectedStudents.length} students
                  </h1>
                </div>
                <CustomSelect
                  options={customizedTeachers}
                  isButton={true}
                  handler={handleChangeMultipleDiaries}
                />
              </Modal>
            )}
            {modal.show && modal.type === "multiple-proxy" && (
              <Modal
                onClose={() => setModal({ show: false, type: "" })}
                className="h-fit"
                headingStyles="text-sm decoration-0"
                heading="select teacher to assign proxies"
              > 
                <div className="mt-8 mb-4 space-y-2">
                  <h1 className="ml-1 tracking-wider font-semibold text-xs text-(--text-secondary)">
                    Students: {selectedStudents.length} students
                  </h1>
                </div>
                <CustomSelect
                  options={customizedTeachers}
                  isButton={true}
                  handler={handleAssignMultipleProxies}
                />
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
        {modal.show && (modal.type === 'diary' || modal.type === 'proxy') &&
          <Modal
            onClose={() => setModal({ show: false, type: "" })}
            className="h-fit"
            headingStyles="text-sm decoration-0"
            heading={
              modal.type === "diary"
                ? "select teacher to change diary"
                : "select teacher to assign proxy"
            }
          >
            <div className="mt-8 mb-4 space-y-2">
              <h1 className="ml-1 tracking-wider font-semibold text-xs text-(--text-secondary)">
                Student: {selectedStudent.name}
              </h1>
              <h1 className="ml-1 tracking-wider font-semibold text-xs text-(--text-secondary)">
                Teacher: {selectedStudent.teacher}
              </h1>
              {selectedStudent.proxyTeacher && (
                <h1 className="ml-1 tracking-wider font-semibold text-xs text-(--text-secondary)">
                  proxy assigned to: {selectedStudent.proxyTeacher}
                </h1>
              )}
            </div>
            <CustomSelect
              options={customizedTeachers}
              isButton={true}
              handler={
                modal.type === "diary" ? handleChangeDiary : handleAssignProxy
              }
            />
          </Modal>
        }
        <ContextMenu>
          {user.role === "admin" && (
            <Item onClick={() => setModal({ show: true, type: "diary" })}>
              <FaEdit className="mr-2" /> change diary
            </Item>
          )}
          {user.role === "admin" && <Separator />}

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


import { HiOutlineExclamationCircle } from "react-icons/hi2";
import { MdOutlinePersonSearch } from "react-icons/md";

function RecordWithNumberCard() {
  const [showSelector,setShowSelector] = useState(false);
  const {students} = useAppProvider();
  const router = useRouter();
  const formatedStudents = students?.map(el => {
    const name = el.name.split(' ').filter((el,i) => i !== 1 ? true : false).join(' ');
    // const name = el.name.split(' ').filter(el => el.toLowerCase() !== 'bhai').join(' ');
    return { label: name, value: el._id };
  });
  function handleSelect({value:id,label:studentName}){
    router.replace(`/entry/${id}?studentName=${studentName}`);
  }
  return (
    <div className=" my-4 flex items-center justify-between rounded-2xl border border-amber-300 border-dashed bg-red-100 p-4">
      <div className="flex items-center gap-4 w-[70%]">
        <div className="flex items-center justify-center rounded-full bg-red-100">
          <HiOutlineExclamationCircle
            size={28}
            className="text-red-700"
          />
        </div>

        <div>
          <h3 className=" font-semibold text-amber-950">
            Student not tagged?
          </h3>

          <p className="text-xs text-amber-800/80">
            student is not in your diary ? just select student from list.
          </p>
        </div>
      </div>

      <button onClick={()=>setShowSelector(true)} className="flex items-center text-xs rounded-md border border-red-400 bg-white p-2 py-2 gap-1 font-semibold text-red-800 transition hover:bg-red-50">
        {/* <MdOutlinePersonSearch  /> */}
        Select Student
      </button>
      {showSelector && <Modal onClose={()=>setShowSelector(false)} heading={'Select Student'} className="w-[90%]">
        <CustomSelect options={formatedStudents} handler={handleSelect} handleOnChange/>
      </Modal>}
    </div>
  );
}