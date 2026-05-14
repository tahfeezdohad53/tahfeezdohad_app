'use client';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import StudentCard from "./StudentCard";
import axios from "axios";
import ContextMenu from "../ContextMenu";
import { Item, Separator, useContextMenu } from "react-contexify";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import CustomSelect from "../Select";
import Modal from "../Modal";
import { useAppProvider } from "../providers/AppProvider";
import { useState } from "react";
import toast from "react-hot-toast";

function StudentsContainer({ session }) {
    const {teachers} = useAppProvider();
    const queryClient = useQueryClient();
      const { show } = useContextMenu({
        id: "student",
      });
      const [modal,setModal] = useState({show:false,type:''});
      const [selectedStudent,setSelectedStudent] = useState({name:'',id:'',teacher:'',proxyTeacher:''});
      
      function showContextMenu(e) {
        const target = e.target.closest('.menu-btn')
        if(!target) return;
        const {studentid,studentname,teachername,proxyteachername} = target.dataset
        setSelectedStudent({name:studentname,id:studentid,teacher:teachername,proxyTeacher:proxyteachername});
        show({ event: e});
      }
    
      async function handleChangeDiary(teacherId){
        try{
            const res = await axios.patch(`${process.env.NEXT_PUBLIC_URL}/student/changeDiary?studentId=${selectedStudent.id}&teacherId=${teacherId}`,{},{headers:{Authorization:`Bearer ${session.jwt}`}});
            if(res.data.ok) {
                queryClient.invalidateQueries(['myStudents'])
                setModal({show:false,type:''});
                return toast.success("student diary updated");
            }
        }catch(err){
            console.log(err);
            toast.error('failed to change student diary')
        }
      }
      async function handleAssignProxy(teacherId){
        try{
            const res = await axios.patch(`${process.env.NEXT_PUBLIC_URL}/student/assignProxy?studentId=${selectedStudent.id}&teacherId=${teacherId}`,{},{headers:{Authorization:`Bearer ${session.jwt}`}});
            if(res.data.ok) {
                queryClient.invalidateQueries(['myStudents'])
                setModal({show:false,type:''});
                return toast.success("proxy assigned");
            }
        }catch(err){
            console.log(err);
            if(!err.response.data.ok) return toast.error(err.response.data.message);
            toast.error('failed to assign proxy')
        }
      }
      const { data:students } = useQuery({
          queryKey: ["myStudents"],
    queryFn:handleGetMyStudents,
    refetchOnWindowFocus:false,
});

async function handleGetMyStudents() {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/student/getStudents`, {
        headers: { Authorization: `Bearer ${session?.jwt}` },
      });
      console.log(res.data.students)
      return res.data.students;
    } catch (err) {
        console.log(err);
        return [];
    }
}
if(!session?.currentUser?.role) return null;
const customizedTeachers = teachers?.map(el => ({label:el.name,value:el._id}))
  return (
    <div onClick={showContextMenu} className="grid grid-cols-2 gap-y-6">
      {students?.length > 0 &&
        students.map((el) => (
          <StudentCard
            key={el._id}
            image={el?.profileImage}
            name={el.name}
            studentId={el._id}
            proxyTeacherId={el.proxyTeacher?._id}
            teacherId={session.currentUser._id}
            teacherName={el.teacher.name}
            proxyTeacherName={el?.proxyTeacher?.name}
          />
        ))}
      {students?.length < 1 && (
        <h1 className="absolute top-1/2 left-1/2 -translate-1/2 font-bold text-xl tracking-wider text-center w-3/4">
          you don&apos;t have any students tagged yet!
        </h1>
      )}
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
            <h1 className="ml-1 tracking-wider font-semibold text-xs text-amber-800">
              Student: {selectedStudent.name}
            </h1>
            <h1 className="ml-1 tracking-wider font-semibold text-xs text-amber-800">
              Teacher: {selectedStudent.teacher}
            </h1>
            {selectedStudent.proxyTeacher && <h1 className="ml-1 tracking-wider font-semibold text-xs text-amber-800">
              proxy assigned to: {selectedStudent.proxyTeacher}
            </h1>}
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
        {session.currentUser.role === "admin" && (
          <Item onClick={() => setModal({ show: true, type: "diary" })}>
            <FaEdit className="mr-2" /> change diary
          </Item>
        )}
        {session.currentUser.role === "admin" && <Separator />}

        <Item onClick={() => setModal({ show: true, type: "proxy" })}>
          <FaEdit className="mr-2" /> assign proxy
        </Item>
        {session.currentUser.role === "admin" && <Separator />}
        {session.currentUser.role === "admin" && (
          <Item onClick={() => console.log("Delete")}>
            <MdDelete className="mr-2" /> delete student
          </Item>
        )}
      </ContextMenu>
    </div>
  );
}

export default StudentsContainer;
