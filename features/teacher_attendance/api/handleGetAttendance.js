import { api } from "@/lib/axios";

export async function handleGetAttendance({
  page,
  startDate,
  endDate,
  teacher,
  batch
}) {
  const { data } = await api.get(
    `/teacherAttendance/get?page=${page}&startDate=${startDate || ""}&endDate=${endDate || ""}&teacher=${teacher || ""}&batch=${batch || ""}`,
  );

  return data;
}