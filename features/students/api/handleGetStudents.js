import { api } from "@/lib/axios";

export async function handleGetStudents({searchParams}) {
    console.log('fetching');
    console.log(searchParams);
  try {
    const res = await api.get(`/student/getStudents?${searchParams}`);
    return res.data.students;
  } catch (err) {
    console.log(err);
    return [];
  }
}