'use client';
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { createContext, useContext } from "react";

const Context = createContext();
function UserProvider({ children }) {

  const session = useSession();
   const { data:user,isFetching } = useQuery({
     queryKey: ["user",session.data],
     queryFn: handleGetUser,
     refetchOnWindowFocus: false,
    //  enabled: !!session.data?.jwt,
   });
   // console.log(session.data?.jwt);

   async function handleGetUser() {
     try {
       const res = await axios.get(
         `${process.env.NEXT_PUBLIC_URL}/user/getUser`,
         { withCredentials:true },
       );
       return res.data.user;
     } catch (err) {
       console.log(err);
       return {};
     }
   }
  return <Context.Provider value={{ user,isFetching }}>{children}</Context.Provider>;
}

export default UserProvider;

export function useUser() {
  const context = useContext(Context);

  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }

  return context;
}