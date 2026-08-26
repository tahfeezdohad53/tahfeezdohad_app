'use client';

import { updatePassword } from "@/actions/profile";
import { useUser } from "../providers/UserProvider";

function UpdatePassword() {
  const {user} = useUser();
    if(user?._id && user?.role !== 'admin')return (
      <form action={updatePassword} className="flex flex-col gap-2">
        <label className="text-[#6f542d] text-sm">update password</label>
        <input
        required
          name="password"
          type="text"
          placeholder="password"
          className="bg-white/70 border border-[#d8c08e] text-[#4d3718] rounded-xl px-4 py-3 outline-none focus:border-[#8b6a36] focus:bg-white transition placeholder:text-[#9a8259]"
        />
        <button className="w-full flex gap-2 items-center justify-center bg-[#5c4320] text-white py-3 rounded-xl font-semibold hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] transition shadow-md mt-2">
          update password
        </button>
      </form>
    );
}

export default UpdatePassword
