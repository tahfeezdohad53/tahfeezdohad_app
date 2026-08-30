"use client";

import { useUser } from "@/app/_components/providers/UserProvider";
import useFilter from "@/shared/hooks/useFilter";
import { useQuery } from "@tanstack/react-query";
import { handleGetStudents } from "../api/handleGetStudents";
import { useEffect, useState } from "react";

function useStudents() {
    const {searchParams} = useFilter();
    const {user} = useUser();
    const [filteredStudents, setFilteredStudents] = useState([]);
    
  const {
    data: students,
    isLoading,
    isFetching: isFetchingStudents,
  } = useQuery({
    queryKey: [
      "myStudents",
      user?.role,
      searchParams.get("batch"),
      searchParams.get("classStatus"),
    ],
    queryFn: () => handleGetStudents({searchParams:`batch=${searchParams.get("batch")}&classStatus=${searchParams.get("classStatus")}`}),
    refetchOnWindowFocus: false,
    enabled: user?.role === "teacher" || user?.role === "admin",
  });

  useEffect(() => {
    if (students) setFilteredStudents(students);
  }, [students]);

  return {students,isLoading,isFetchingStudents,filteredStudents,setFilteredStudents};
  
}

export default useStudents;
