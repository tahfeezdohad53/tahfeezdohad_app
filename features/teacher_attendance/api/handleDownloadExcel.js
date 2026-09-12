import { api } from "@/lib/axios";

export async function handleDownloadExcel(searchParams){
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const teacher = searchParams.get('teacher');

    const { data } = await api.get(
        `/teacherAttendance/excel?startDate=${startDate || ""}&endDate=${endDate || ""}&teacher=${teacher || ""}`,
        {responseType:'blob'}
      );

      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'attendance.xlsx';
      document.documentElement.appendChild(a);

      a.click();

      document.documentElement.removeChild(a);
      window.URL.revokeObjectURL(url);

}