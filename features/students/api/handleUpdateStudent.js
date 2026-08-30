import { api } from "@/lib/axios";

export async function handleUpdateStudent({type}){
    setIsSubmitting(true);
    
      const res = await api.patch(`/student/changeDiary?studentId=${selectedStudent.id}&teacherId=${teacherId}`);
      if (res.data.ok) {
        // queryClient.invalidateQueries({ queryKey: ["myStudents"] });

        // setModal({ show: false, type: "" });
        // return toast.success("student diary updated");
      }
}
