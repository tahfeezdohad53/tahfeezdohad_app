'use client'
import { handleLogout } from "@/actions/auth";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FaSignOutAlt } from "react-icons/fa";
import { useUser } from "../providers/UserProvider";
import { useSocketContext } from "../providers/SocketProvider";

export default function LogoutButton() {
  const queryClient = useQueryClient();
  const {user,setUser} = useUser();
  const {socket} = useSocketContext();
  async function handleLogoutClient(){
    try{
      await axios.get(`${process.env.NEXT_PUBLIC_URL}/auth/logout`,{withCredentials:true});
      // socket?.disconnect();
      setUser({});
      await handleLogout();
    }catch(err){
      console.log(err);
    }
  }
  return (
    // <form action={handleLogout}>
      <button onClick={handleLogoutClient} className="w-full flex gap-2 items-center justify-center bg-(image:--gradient-light) border-2 border-(--border) text-(--text-secondary) py-3 rounded-xl font-semibold hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] transition shadow-md mt-2">
        <FaSignOutAlt size={18} />
        Logout
      </button>
    // </form>
  );
}
