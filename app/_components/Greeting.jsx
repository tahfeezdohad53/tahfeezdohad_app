'use client'

import { useEffect, useState } from "react";
import { HiSparkles } from "react-icons/hi2";
import { useUser } from "./providers/UserProvider";

function Greeting() {
    const [isGreetingDone,setIsGreetingDone] = useState(null);
    useEffect(() => {
      setIsGreetingDone(localStorage.getItem("greetingDismissed") === "true");
    }, []);
    const {user} = useUser();
    if(!isGreetingDone && user?._id && isGreetingDone !== null)return (
      <div className="flex items-center justify-center fixed top-0 left-1 h-full w-full backdrop-brightness-50 z-999999">
        <div className="lg:ml-40 w-3/4 lg:w-fit rounded-2xl bg-(--card) p-8 pb-5 shadow-(--shadow-md)">
          <div className="flex flex-col items-center gap-4">
            <div className="flex min-h-14 min-w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <HiSparkles size={28} />
            </div>

            <div className="">
              <h1 className="text-2xl font-bold text-(--foreground) text-center">
                Welcome to TahfeezDohad.org
              </h1>

              <p className="mt-1 text-(--muted-foreground) text-xs text-center">
                We hope you have a great experience.
              </p>
            </div>
            <button onClick={() => {
                setIsGreetingDone(true);
                localStorage.setItem('greetingDismissed','true');
            }} className="mt-2 bg-(image:--gradient-primary) text-white py-1 px-3 rounded-md shadow-(--shadow-lg)">
              close
            </button>
          </div>
        </div>
      </div>
    );
}

export default Greeting
