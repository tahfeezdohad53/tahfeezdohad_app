'use client';
import { useEffect, useState } from "react";
import { FaBell, FaCloudUploadAlt } from "react-icons/fa";
import { useUser } from "./providers/UserProvider";
import { formatName } from "@/helpers";

const ids = [
  "6a57a6bf4a5745965fcc1a83",
  "6a57a6bf4a5745965fcc1a84",
  "6a57a6bf4a5745965fcc1a56",
  "6a57a6bf4a5745965fcc1a57",
  "6a57a6bf4a5745965fcc1a6f",
  "6a57a6bf4a5745965fcc1a5d",
  "6a57a6bf4a5745965fcc1a50",
  "6a57a6bf4a5745965fcc1a6d",
  "6a57a6bf4a5745965fcc1a7a",
  "6a57a6bf4a5745965fcc1a85",
  "6a57a6bf4a5745965fcc1a73",
  "6a57a6bf4a5745965fcc1a7e",
  "6a57a6bf4a5745965fcc1a51",
  "6a57a6bf4a5745965fcc1a81",
  "6a57a6bf4a5745965fcc1a58",
  "6a57a6bf4a5745965fcc1a5f",
  "6a57a6bf4a5745965fcc1a4c",
  "6a64cc2942d22712f6fcd011",
  "6a5b88719b8732dabd07a6f6",
];

// if (allowedUserIds.includes(user?._id)) {
//   // Your code here
// }
function Appreciation() {
    const [isAppreciated,setIsAppreciated] = useState(null);
    const {user} = useUser();
    useEffect(() => {
        const isAppreciated = localStorage.getItem('isAppreciated');
        setIsAppreciated(isAppreciated === 'true' ? true : false);
    },[user])

    function handleClose(){
        setIsAppreciated(true);
        localStorage.setItem('isAppreciated','true');
        localStorage.removeItem('notification');
    }
    if(ids.includes(user?._id) && !isAppreciated)return (
      <div className="z-999 fixed top-0 left-0 flex h-full w-full items-center justify-center backdrop-brightness-50">
        <div className="flex w-[90%] flex-col justify-center rounded-2xl bg-(--card) p-5 shadow-md">
          {/* Heading */}
          <div className="mb-5 flex items-center justify-center gap-2 border-b border-(--border) pb-3">
            <span className="text-2xl">🌟</span>
            <h3 className="text-lg font-semibold text-(--foreground)">
              A Special Appreciation
            </h3>
          </div>

          {/* Appreciation Card */}
          <div className="rounded-xl border border-amber-500/20 bg-(--card-hover) p-4">
          <h2 className="mb-5">{formatName(user?.name)},</h2>
            <p className="mt-2 text-sm leading-7 text-(--muted-foreground)">
              Your consistency in recording classes has not gone unnoticed. We
              truly appreciate your dedication and commitment.
            </p>

            <p className="mt-3 text-sm leading-7 text-(--muted-foreground)">
              This appreciation message has been shared with only a few teachers
              whose consistency has been exceptional.
            </p>
          </div>

          <button
            onClick={handleClose}
            className="mt-4 self-end rounded-md bg-(image:--gradient-primary) px-4 py-2 text-sm text-white"
          >
            Close
          </button>
        </div>
      </div>
    );
}

export default Appreciation
