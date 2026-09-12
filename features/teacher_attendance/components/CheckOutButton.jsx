"use client";

import { IoIosLogOut } from "react-icons/io";
import useCheckOut from "../hooks/useCheckOut";
import { ImSpinner2 } from "react-icons/im";
import toast from "react-hot-toast";

function CheckOutButton() {
  const mutate = useCheckOut();
  async function checkOut() {
    // toast.loading('Checking out...',{id:'checkOut'});
    await mutate.mutateAsync();
  }
  return (
    <button
      onClick={checkOut}
      disabled={mutate.isPending}
      className="relative flex items-center gap-2 bg-red-500 text-xs py-3 px-3 shadow-(--shadow-sm) text-white rounded-md borde border-(--primary)"
    >
      <span className={`flex items-center gap-2 ${mutate.isPending ? "opacity-0" : "opacity-100"}`}>
        <IoIosLogOut /> Check out
      </span>
      <span
        className={`${mutate.isPending ? "opacity-100" : "opacity-0"} animate-spin absolute top-1/2 left-1/2 -translate-1/2`}
      >
        <ImSpinner2 />
      </span>
    </button>
  );
}

export default CheckOutButton;
