'use client';
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";

const Context = createContext();
function UserProvider({ children }) {

  const session = useSession();
  const [user,setUser] = useState({});
  const [isFetching,setIsFetching] = useState(false);
   const { data:token } = useQuery({
     queryKey: ["token",session?.status],
     queryFn:() =>  getCookie(session),
     refetchOnWindowFocus: false,
   });

    async function getCookie(session){
      console.log(session);
      if(session.status === 'loading') return null;
      try{
        let res;
        if(session?.data?.idToken){
          res = await axios.post(
            `${process.env.NEXT_PUBLIC_URL}/auth/googleSignin`,
            { role: session?.data?.role, idToken: session?.data?.idToken },
            { withCredentials: true },
          );
        }
        setIsFetching(true);
        const ress = await axios.get(
         `${process.env.NEXT_PUBLIC_URL}/user/getUser`,
         { withCredentials: true },
       );
       setUser(ress.data.user);
        return null;
      }catch(err){
        console.log('something went wrong');  
        return null;
      }finally{
        setIsFetching(false);
      }
    }
  return <Context.Provider value={{ user,isFetching,setUser }}>{children}</Context.Provider>;
}

export default UserProvider;

export function useUser() {
  const context = useContext(Context);

  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }

  return context;
}