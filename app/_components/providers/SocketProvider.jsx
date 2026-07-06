'use client';

import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useUser } from "./UserProvider";

const Context = createContext();
function SocketProvider({children}) {
    // const session = useSession();
    const {user,isFetching} = useUser();
    const [socket,setSocket] = useState();
     useEffect(() => {
      if(isFetching) return;
      if(!user?._id && !isFetching){
        if(socket) {
          // console.log('disconnecting socket cause no user id');
          socket.disconnect();
        }
        return;
      }
      // console.log('connecting socket'); 
       const newSocket = io(`${process.env.NEXT_PUBLIC_URL}`, {
         withCredentials:true,
       });
// console.log('socket connected: ',newSocket.connected)
       setSocket(newSocket);

      //  return () => {
      //    newSocket.disconnect();
      //    console.log("🔌 Socket disconnected from cleanup");
      //  };
     }, [user?._id,isFetching]);
    return (
        <Context.Provider value={{socket}}>
            {children}
        </Context.Provider>
    )
}

export function useSocketContext() {
  return useContext(Context);
}

export default SocketProvider
