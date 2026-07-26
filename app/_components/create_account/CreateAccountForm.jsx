'use client';
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  HiOutlineUserPlus,
  HiOutlineIdentification,
  HiOutlineUser,
  HiOutlineLockClosed,
} from "react-icons/hi2";
import { IoIosArrowDown } from "react-icons/io";
import { useAppProvider } from "../providers/AppProvider";
import CustomSelect from "../Select";
import axios from "axios";
import toast from "react-hot-toast";

export default function CreateAccountForm() {
  const { teachers } = useAppProvider();

  const {
    register,
    control,
    watch,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      its: "",
      name: "",
      role: "",
      batch: "",
      teacher: "",
    },
  });

  const role = watch("role");

  const formattedTeacher =
    teachers?.map((el) => ({
      label: el.name,
      value: el._id,
    })) || [];

  

  async function onSubmit(data) {
    console.log('submitting');
    // reset();
    try{
        const res = await axios.post(`${process.env.NEXT_PUBLIC_URL}/user/create`,data,{withCredentials:true});
        toast.success('account createad');
        reset();
    }catch(err){
        console.log(err);
        if(err.response.data.message) return toast.error(err.response.data.message);
        else toast.error('something went wrong!');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full my-auto max-w-5xl rounded-3xl bg-(--card) p-5 shadow-(--shadow-lg) md:p-8"
    >
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
          <HiOutlineUserPlus className="text-amber-700" size={28} />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-amber-950 md:text-3xl">
            Create Account
          </h2>

          <p className="text-sm text-amber-800/70">
            Add a new student or teacher.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* ITS */}
        <div>
          <label className="mb-2 block font-semibold text-amber-950">
            ITS No.
          </label>

          <div className="relative">
            <HiOutlineIdentification
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-700"
            />

            <input
              {...register("its", {
                required: "ITS is required",
                minLength: {
                  value: 8,
                  message: "its can only contain 8 digits",
                },
                maxLength: {
                  value: 8,
                  message: "its cannot contain more than 8 digits",
                },
              })}
              type="number"
              placeholder="Enter ITS Number"
              className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 outline-none transition focus:border-amber-500"
            />
          </div>

          {errors.its && (
            <p className="mt-1 text-sm text-red-600">{errors.its.message}</p>
          )}
        </div>

        {/* Name */}
        <div>
          <label className="mb-2 block font-semibold text-amber-950">
            Full Name
          </label>

          <div className="relative">
            <HiOutlineUser
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-700"
            />

            <input
              {...register("name", {
                required: "Full Name is required",
              })}
              placeholder="Enter Full Name"
              className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 outline-none transition focus:border-amber-500"
            />
          </div>

          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Role */}
        <div>
          <label className="mb-2 block font-semibold text-amber-950">
            Role
          </label>

          <div className="relative">
            <HiOutlineUser
              size={20}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-amber-700"
            />

            <select
              {...register("role", {
                required: "Role is required",
              })}
              className="w-full appearance-none rounded-xl border border-gray-300 bg-white py-3 pl-12 pr-10 outline-none transition focus:border-amber-500"
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>

            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-amber-700">
              <IoIosArrowDown />
            </span>
          </div>

          {errors.role && (
            <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
          )}
        </div>

        {/* Student Only Fields */}
        {role === "student" && (
          <>
            {/* Batch */}
            <div>
              <label className="mb-2 block font-semibold text-amber-950">
                Batch
              </label>

              <div className="relative">
                <HiOutlineIdentification
                  size={20}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-amber-700"
                />

                <select
                  {...register("batch", {
                    required: "Batch is required",
                  })}
                  className="w-full appearance-none rounded-xl border border-gray-300 bg-white py-3 pl-12 pr-10 outline-none transition focus:border-amber-500"
                >
                  <option value="">Select Batch</option>
                  <option value="yaqoot_mardo">Yaqoot (Mardo)</option>
                  <option value="yaqoot_bairo">Yaqoot (Bairo)</option>
                  <option value="baneen">Baneen</option>
                  <option value="banaat">Banaat</option>
                  <option value="kibaar">Kibaar</option>
                  <option value="taheri_hall">Taheri hall</option>
                </select>

                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-amber-700">
                  <IoIosArrowDown />
                </span>
              </div>

              {errors.batch && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.batch.message}
                </p>
              )}
            </div>

            {/* Teacher */}
            <div>
              <label className="mb-2 block font-semibold text-amber-950">
                Select Teacher
              </label>

              <Controller
                name="teacher"
                control={control}
                rules={{ required: {value:role === 'student' , message:'teacher is required'}}}
                
                render={({ field }) => (
                  <CustomSelect
                //   controlled
                  handleOnChange
                //   extValue={field.value}
                    options={formattedTeacher}
                    handler={(teacher) => field.onChange(teacher.value)}
                  />
                )}
              />

              {errors.teacher && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.teacher.message}
                </p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Buttons */}
      <div className="mt-8 grid grid-cols-2 gap-3 lg:w-1/3">
        <button
        onClick={()=>reset()}
          type="button"
          className="rounded-xl hover:cursor-pointer duration-300 ease-in-out transition-all border border-amber-300 px-6 py-3 font-semibold text-amber-800 transition hover:bg-amber-50"
        >
          reset
        </button>

        <button
          type="submit"
          className="rounded-xl hover:cursor-pointer duration-300 ease-in-out transition-all bg-amber-700 px-6 py-3 font-semibold text-white transition hover:bg-amber-800"
        >
          Create
        </button>
      </div>
    </form>
  );
}
