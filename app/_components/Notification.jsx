"use client";

import { useEffect, useState } from "react";

import {
  FaLocationDot,
  FaRightToBracket,
  FaSatelliteDish,
  FaUserShield,
  FaRightFromBracket,
  FaCircleInfo,
  FaCheck,
} from "react-icons/fa6";

import { useUser } from "./providers/UserProvider";

function Notification() {
  const { user } = useUser();
  const [isNotifiedAboutAttendancePage, setIsNotifiedAboutAttendancePage] = useState(null);

  useEffect(() => {
    const notified = localStorage.getItem("isNotifiedAboutAttendancePage");
    setIsNotifiedAboutAttendancePage(notified === "true");
  }, []);

  function handleClose() {
    localStorage.removeItem("isNotifiedAboutLosingRecording");
    localStorage.setItem("isNotifiedAboutAttendancePage","true");
    setIsNotifiedAboutAttendancePage(true);
  }

  if (user?.role === "student") return;

  if (!user?._id || isNotifiedAboutAttendancePage === null) {
    return null;
  }

  if (isNotifiedAboutAttendancePage) {
    return null;
  }

  if(user?.role === 'teacher' || user?.role === 'admin')return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/50 p-1 px-4 backdrop-blur-[2px]">
      <div className="h-[99%] w-full overflow-auto rounded-2xl bg-(--card) shadow-2xl lg:h-fit lg:w-1/3">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-(--border) px-5 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--primary)/10 text-(--primary)">
            <FaLocationDot size={17} />
          </div>

          <div>
            <h2 className="text-base font-semibold text-(--foreground)">
              Check-In & Check-Out
            </h2>

            <p className="mt-0.5 text-xs text-gray-500">
              A new attendance system is now available
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 py-5">
          <p className="text-sm leading-6 text-(--foreground)">
            We’ve introduced a new{" "}
            <span className="font-semibold">Check-In & Check-Out</span> system
            to make attendance more accurate and reliable. Please follow the
            steps below whenever you start and finish your day.
          </p>

          {/* Check In */}
          <div className="mt-5 flex gap-3 rounded-xl border border-(--border) bg-(--card-hover) p-3.5">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--primary)/10 text-(--primary)">
              <FaRightToBracket size={13} />
            </div>

            <div>
              <p className="text-sm font-semibold text-(--foreground)">
                1. Check In
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                When you check in, the system will first verify whether your GPS
                location is working accurately. If it is accurate, your current
                location will then be checked against your designated location.
              </p>
            </div>
          </div>

          {/* GPS Verification */}
          <div className="mt-3 flex gap-3 rounded-xl border border-(--border) bg-(--card-hover) p-3.5">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--primary)/10 text-(--primary)">
              <FaSatelliteDish size={13} />
            </div>

            <div>
              <p className="text-sm font-semibold text-(--foreground)">
                2. GPS & Location Verification
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                If your GPS is accurate, the system will verify whether you are
                within your designated attendance location. If your GPS cannot
                provide a reliable location, you will still be checked in.
              </p>
            </div>
          </div>

          {/* Admin Verification */}
          {/* <div className="mt-3 flex gap-3 rounded-xl border border-(--border) bg-(--card-hover) p-3.5">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--primary)/10 text-(--primary)">
              <FaUserShield size={13} />
            </div>

            <div>
              <p className="text-sm font-semibold text-(--foreground)">
                3. Admin Verification
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                Your daily attendance will be reviewed by the administration.
                Only attendance that has been successfully verified will be
                counted as your official attendance.
              </p>
            </div>
          </div> */}

          {/* Check Out */}
          <div className="mt-3 flex gap-3 rounded-xl border border-(--border) bg-(--card-hover) p-3.5">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--primary)/10 text-(--primary)">
              <FaRightFromBracket size={13} />
            </div>

            <div>
              <p className="text-sm font-semibold text-(--foreground)">
                3. Don’t Forget to Check Out
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                Remember to check out when you leave. Checking out
                helps the system record your complete attendance and working
                duration correctly.
              </p>
            </div>
          </div>

          {/* Important Note */}
          <div className="mt-4 flex gap-2.5 rounded-lg bg-(--primary)/5 px-3.5 py-3">
            <FaCircleInfo
              className="mt-0.5 shrink-0 text-(--primary)"
              size={13}
            />

            <p className="text-xs leading-5 text-(--foreground)">
              <span className="font-semibold">Important:</span> When your
              browser asks for location permission, make sure to enable Precise
              location. Also, don’t forget to check out before leaving.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-(--border) px-5 py-4">
          <button
            onClick={handleClose}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-(--primary) px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 active:scale-[0.99]"
          >
            <FaCheck size={12} />
            Got it
          </button>

          <p className="mt-2 text-center text-[10px] text-gray-400">
            Regards, System Administrator
          </p>
        </div>
      </div>
    </div>
  );
}

export default Notification;

// localStorage.setItem("recordingsPrivacyNotified", "true");
