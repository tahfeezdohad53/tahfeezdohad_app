"use client";

import { IoIosLogOut } from "react-icons/io";
import useCheckOut from "../hooks/useCheckOut";
import { ImSpinner2 } from "react-icons/im";
import toast from "react-hot-toast";
import { useUser } from "@/app/_components/providers/UserProvider";
import QRScanner from "./QRScanner";
import { useState } from "react";
const allowedUsers = [
  "6a57a6bf4a5745965fcc1a4f",
  "6a54f70a591f80d8af05b147",
  "6a5b88719b8732dabd07a6f6",
  "6a57a6bf4a5745965fcc1a6f",
  "6a66c6ec0ac99e1aa300a2de",
  "6a64cc2942d22712f6fcd011",
  "6a57a6bf4a5745965fcc1a73",
  "6a64cc2942d22712f6fcd011",
  "6a57a6bf4a5745965fcc1a74",
];
function CheckOutButton() {
  const {user} = useUser();
  const [isShowScanner,setIsShowScanner] = useState(false);

  const mutate = useCheckOut();
  async function checkOut() {
    // const date = new Date(user.lastStatusTime);
    // const hour = date.getHours();

    // if(hour > 12 && hour < 16) return toast.error('you cannot checkout now, please contact admin!');
    // if(hour > 18) return toast.error("you cannot checkout now, please contact admin!");
    // if(hour >= 0 && 7) return toast.error("you cannot checkout now, please contact admin!");
    await mutate.mutateAsync();
  }
  return (
    <button
      onClick={async () => {
        if(localStorage.getItem('checkedInBatch') === 'online'){
          await mutate.mutateAsync();
          localStorage.removeItem('checkedInBatch');
          return;
        }
        if(!allowedUsers.includes(user?._id)) {
          console.log(allowedUsers.includes(user?._id));
          return await checkOut();
        }
        setIsShowScanner(true);
      }}
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
      {isShowScanner && <QRScanner type="checkOut" close={() => setIsShowScanner(false)}/>}
    </button>
  );
}

export default CheckOutButton;
