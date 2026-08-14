'use client';

import { useEffect, useState } from "react";
import { useUser } from "./providers/UserProvider";
import toast from "react-hot-toast";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { ImSpinner2 } from "react-icons/im";
import { AiOutlineMail } from "react-icons/ai";

export default function SecondaryEmailForm() {
    const {user} = useUser();
    const [contactEmail,setContactEmail] = useState('');
    const [isSub,setIsSub] = useState(false);
    const querClient = useQueryClient();
    async function handleSubmit(e){
        e.preventDefault();
        if(!contactEmail) return toast.error('please enter email');
        setIsSub(true);
        try{
            await axios.patch(`${process.env.NEXT_PUBLIC_URL}/user/contactEmail`,{contactEmail},{withCredentials:true})
            toast.success('email submitted');
            querClient.invalidateQueries({queryKey:['token']});
        }catch(err){
            console.log(err);
            toast.error('failed to submit email');
        }finally{
            setIsSub(false);
        }
    }
  if(user?._id && !user?.contactEmai && !user?.name.includes('tahfeez'))return (
    <div className="fixed h-screen w-full flex items-center justify-center backdrop-brightness-60 z-999">
      <div className=" w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="flex items-center gap-2 border-b pb-3 border-b-gray-200  text-lg font-semibold text-gray-900">
         <AiOutlineMail /> Add contact email
        </h2>

        <p className="mt-3 text-sm text-gray-500">
          You will receive notifications from Tahfeez Dohad on this email.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <input
            required
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            type="email"
            placeholder="Enter contact email"
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <button
            type="submit"
            className="relative w-full rounded-xl bg-blue-600 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 active:scale-[0.98]"
          >
            <span className={`${!isSub ? 'opacity-100':'opacity-0'}`}>Submit</span>
            <span className={`${isSub ? 'opacity-100':'opacity-0'} absolute top-1/2  left-1/2 -translate-1/2`}><ImSpinner2 className=" animate-spin"/></span>
          </button>
        </form>
      </div>
    </div>
  );
}
