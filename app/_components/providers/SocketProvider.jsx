'use client';

import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const Context = createContext();
function SocketProvider({children}) {
    const session = useSession();
    const [socket,setSocket] = useState();
     useEffect(() => {
        const token = session?.data?.jwt;
       if (!token) return;

       const newSocket = io(`${process.env.NEXT_PUBLIC_URL}`, {
         auth: { jwt: token },
       });

       setSocket(newSocket);

       return () => {
         newSocket.disconnect();
         console.log("🔌 Socket disconnected");
       };
     }, [session?.data?.jwt]);
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
