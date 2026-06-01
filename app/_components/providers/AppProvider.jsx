"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./UserProvider";

const Context = createContext();
function AppProvider({ children }) {
  const {user} = useUser();
    const [teachers,setTeachers] = useState();
    const [students,setStudents] = useState();

    const {data} = useQuery({
        queryKey:['students'],
        queryFn:handleGetStudents,
        refetchOnWindowFocus:false,
        enabled:!!user?.role,
    })
    // console.log(session.data?.jwt);
    
    async function handleGetStudents(){
      try{
        const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/student/getAllStudentsAndTeachers`,{withCredentials:true})
        console.log(res.data);
        setTeachers(res.data?.teachers);
        setStudents(res.data?.students);
      return [];
      }catch(err){
        console.log(err);
        return [];
      }
    }
  return <Context.Provider value={{ teachers,students }}>{children}</Context.Provider>;
}

export default AppProvider;

export function useAppProvider() {
  const context = useContext(Context);

  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }

  return context;
}
