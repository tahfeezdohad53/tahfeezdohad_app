"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useUser } from "./UserProvider";

const Context = createContext();
function AppProvider({ children }) {
  const {user} = useUser();
    const containerRef = useRef(null);
  const [filteredGurfahStudents, setFilteredGurfahStudents] = useState([]);
  
    // const [teachers,setTeachers] = useState();
    // const [students,setStudents] = useState();

    const {data} = useQuery({
        queryKey:['students&teachers'],
        queryFn:handleGetStudents,
        refetchOnWindowFocus:false,
        enabled:!!user?.role,
        staleTime:Infinity,
        gcTime:Infinity,
    })
    // console.log(session.data?.jwt);
    
    async function handleGetStudents(){
      try{
        const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/student/getAllStudentsAndTeachers`,{withCredentials:true})
        console.log(res.data);
        return res.data
      }catch(err){
        console.log(err);
        return [];
      }
    }

const teachers = data?.teachers;
const students = data?.students;
  return <Context.Provider value={{ teachers,students,containerRef,filteredGurfahStudents,setFilteredGurfahStudents }}>{children}</Context.Provider>;
}

export default AppProvider;

export function useAppProvider() {
  const context = useContext(Context);

  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }

  return context;
}
