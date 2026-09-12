import { api } from "@/lib/axios";

export async function handleGetAttendance({
  page,
  startDate,
  endDate,
  teacher,
}) {
  const { data } = await api.get(
    `/teacherAttendance/get?page=${page}&startDate=${startDate || ""}&endDate=${endDate || ""}&teacher=${teacher || ""}`,
  );

  return data;
}