'use client'
import { handleLogout } from "@/actions/auth";
import axios from "axios";
import { FaSignOutAlt } from "react-icons/fa";

export default function LogoutButton() {
  async function handleLogoutClient(){
    try{
      await axios.get(`${process.env.NEXT_PUBLIC_URL}/auth/logout`,{withCredentials:true});
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
