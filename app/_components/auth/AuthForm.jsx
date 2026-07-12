"use client";

import { AiOutlineMail } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import { GiGraduateCap } from "react-icons/gi";
import { GoShieldCheck } from "react-icons/go";
import GoogleButton from "./GoogleButton";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { CiLock } from "react-icons/ci";

function AuthForm() {
  const [role,setRole] = useState('student');
  const {register,handleSubmit} = useForm();
  const [isSubmitting,setIsSubmitting] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  async function handleSignin(e){
    try{
      const res = await axios.post(`${process.env.NEXT_PUBLIC_URL}/auth/emailSignin`,{email:e.email,password:e.password,role},{withCredentials:true})
      queryClient.invalidateQueries();
      if(role === 'student') router.replace('/gurfah');
      else router.replace('/students');
    }catch(err){
      if(!err.response?.data?.ok && err.response?.data?.message) return toast.error(err.response.data.message);
      else return toast.error('failed to sign in');
    }
  }
  return (
    <div>
      <form onSubmit={handleSubmit(handleSignin)}>
        <div>
          <label htmlFor="" className="text-xs text-(--text-muted)">
            continue as
          </label>
          <div className="overflow-hidden grid grid-cols-3 mt-1 shadow-(--shadow-lg) border border-(--border) rounded-lg">
            <button
            type="button"
              onClick={() => setRole("student")}
              className={`py-5 hover:cursor-pointer flex items-center gap-1 pl-3 pr-4 border-r  border border-(--border) ${role === "student" && "bg-(image:--gradient-light) shadow-(--shadow-lg)"}`}
            >
              <div className="p-2 rounded-full bg-(--primary)/10">
                <FaUser />
              </div>
              <h1 className="text-xs text-(--text)">Student</h1>
            </button>
            <button
            type="button"
              onClick={() => setRole("teacher")}
              className={`py-5 hover:cursor-pointer flex items-center gap-1 pl-3 pr-4 border-r border-(--border) ${role === "teacher" && "bg-(image:--gradient-light) shadow-(--shadow-lg)"}`}
            >
              <div className="p-2 rounded-full bg-(--primary)/10">
                <GiGraduateCap />
              </div>
              <h1 className="text-xs text-(--text)">Teacher</h1>
            </button>
            <button
            type="button"
              onClick={() => setRole("admin")}
              className={`py-5 hover:cursor-pointer flex items-center gap-1  pl-3 pr-4 ${role === "admin" && "bg-(image:--gradient-light) shadow-(--shadow-lg)"}`}
            >
              <div className="p-2 rounded-full bg-(--primary)/10">
                <GoShieldCheck />
              </div>
              <h1 className="text-xs text-(--text)">Admin</h1>
            </button>
          </div>
        </div>
        <div className="mt-2 space-y-6">
          <div className="space-y-1">
            <label htmlFor="email" className="text-xs text-(--text)">
              Email
            </label>
            <div className="relative">
              <AiOutlineMail className="absolute text-(--text) left-3 top-1/2 -translate-y-1/2" />
              <input
                {...register("email", { required: true })}
                required
                placeholder="Enter you email"
                type="email"
                className="py-4 px-10 text-xs tracking-wider text-(--text) bg-(image:--gradient-light) focus:outline-none border border-(--border) rounded-md shadow-(--shadow-lg) w-full"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="email" className="text-xs text-(--text)">
              Password
            </label>
            <div className="relative">
              <CiLock className="absolute text-(--text) left-3 top-1/2 -translate-y-1/2" />
              <input
                {...register("password", { required: true })}
                required
                placeholder="Enter you password"
                type="password"
                className="py-4 px-10 text-xs tracking-wider text-(--text) bg-(image:--gradient-light) focus:outline-none border border-(--border) rounded-md shadow-(--shadow-lg) w-full"
              />
            </div>
          </div>

          <button disabled={isSubmitting} className="w-full rounded-md shadow-(--shadow-md) disabled:bg-(image:--gradient-soft) bg-(image:--gradient-primary) py-3 text-white">
            <p className={`${isSubmitting && 'opacity-0'}`}>Login</p>
            <p className={`${!isSubmitting && 'opacity-0'}`}>Logging...</p>
          </button>
        </div>
      </form>
      <div className="mt-6 space-y-6">
        <div className="flex justify-between items-center gap-5">
          <hr className="flex-1 text-(--text)/50" />
          <p className="text-xs text-(--text-muted)">or continue with</p>
          <hr className="flex-1 text-(--text)/50" />
        </div>
        <GoogleButton role={role} />
      </div>
    </div>
  );
}

export default AuthForm
