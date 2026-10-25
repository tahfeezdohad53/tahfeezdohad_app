import { api } from "@/lib/axios";

export async function handleGetAttendance({
  page,
  startDate,
  endDate,
  teacher,
  batch,
  status
}) {
  const { data } = await api.get(
    `/teacherAttendance/get?page=${page}&startDate=${startDate || ""}&endDate=${endDate || ""}&teacher=${teacher || ""}&batch=${batch || ""}&status=${status || ''}`,
  );

  return data;
}