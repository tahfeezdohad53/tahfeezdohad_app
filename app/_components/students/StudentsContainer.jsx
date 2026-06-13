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
import { useRouter } from "next/navigation";

function StudentsContainer() {
  const { user } = useUser();
  const { teachers } = useAppProvider();
  const queryClient = useQueryClient();
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
    queryKey: ["myStudents",user?.role],
    queryFn: handleGetMyStudents,
    refetchOnWindowFocus: false,
    enabled:(user?.role === 'teacher' || user?.role === 'admin')
  });

  async function handleGetMyStudents() {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/student/getStudents`,
        {
          withCredentials: true,
        },
      );
      setFilteredStudents(res.data.students);
      cl
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
    setFilteredStudents((student) =>
      student.filter((el) => el.name.includes(value)),
    );
  }
  async function handleChangeMultipleDiaries(teacherId){
    try{
      await axios.patch(`${process.env.NEXT_PUBLIC_URL}/student/changeMultipleDiaries`,{teacherId,studentsId:selectedStudents},{withCredentials:true})
      toast.success(`diary updated of ${selectedStudents.length} students`);
      setSelectedStudents([]);
    }catch(err){
      console.log(err);
    }
  }
  if (!user?.role) return null;
  if(user?.role === 'student') {
    return(
      <div className="h-[75vh] flex items-center justify-center">
        <h1>you are not authorized to access this page</h1>
      </div>
    )
  }
  const customizedTeachers = teachers?.map((el) => ({
    label: el.name,
    value: el._id,
  }));
  return (
    <div className="">
      <div className="mb-10 bg-(image:--gradient-primary) mt-2 rounded-xl p-5 flex items-center gap-5 w-full ">
        <div className="p-3 text-white bg-(--primary-light) rounded-lg">
          <FaBook className="text-4xl " />
        </div>
        <div>
          <p className="text-white">{user.name}&apos;s diary</p>
          <p className="text-white/80 text-xs">record and manage students</p>
        </div>
      </div>
      <StudentsFilter handleFilterStudents={handleFilterStudents} />
      {!isSelecting && (
        <button
          onClick={() => setIsSelecting(true)}
          className="mt-5 bg-(image:--gradient-primary) text-white/90 text-sm px-6 py-2 rounded-lg shadow-(--shadow-lg) ml-auto flex items-center gap-2"
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
              className="shadow-(--shadow-lg) border border-(--primary)/50 text-sm rounded-lg bg-(--bg-tertiary)/50 py-2 px-3"
            >
              cancel
            </button>
            <button
              onClick={handleSelectAll}
              className=" bg-(image:--gradient-primary) text-white/90 text-sm px-6 py-2 rounded-lg shadow-(--shadow-lg) ml-auto flex items-center gap-2"
            >
              Select All
            </button>
            <button onClick={()=>setShowCustomContextMenu(!showCustomeContextMenu)} className="">
              <PiDotsThreeVerticalBold />
            </button>
             {showCustomeContextMenu && <CustomContextMenu options={[{text:'change diary',icon:<FaBook />,handler:handleChangeMultipleDiaries}]}/>}
          </div>
        </div>
      )}
      <div
        onClick={showContextMenu}
        className=" grid grid-cols-2 lg:flex lg:flex-wrap lg:justify-center gap-y-6 gap-x-5 mt-5"
      >
        {
          filteredStudents?.map((el) => (
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
        {modal.show && (
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
        )}
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
