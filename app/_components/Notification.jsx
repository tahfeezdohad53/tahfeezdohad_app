'use client';
import { useEffect, useState } from "react";
import { FaBell, FaCloudUploadAlt, FaRegStar, FaStar } from "react-icons/fa";
import { useUser } from "./providers/UserProvider";
import { useSocketContext } from "./providers/SocketProvider";
import { formatName } from "@/helpers";
import toast from "react-hot-toast";

const ratingText = [
  "Very bad",
  "Could be better",
  "Good",
  "Very good",
  "Excellent",
];

function Notification() {
    const [isNotified,setIsNotified] = useState(null);
    const [isRated,setIsRated] = useState(null);
    const [isRatingDismissed,setIsRatingDismissed] = useState(false);
    const [value,setValue] = useState('');
    const [rating,setRating] = useState(0);
    const {user} = useUser();
    const {socket} = useSocketContext();
    useEffect(() => {
        const isRated = localStorage.getItem('isRated2');
        setIsRated(isRated === 'true' ? true : false);
        const isNotified2 = localStorage.getItem('isNotified2');
        setIsNotified(isNotified2 === 'true' ? true : false);
        const isRatingDismissed = localStorage.getItem('ratingDismissed2');
        setIsRatingDismissed(isRatingDismissed === 'true' ? true : false);
    },[])

    function handleClose(){
        setIsRated(true);
        localStorage.setItem('isRated2','true');
    }
    // function handleAnswer(ans){
    //   socket.emit('to-dev',{rating});
    //   toast.success('thank you so much for your feedback!');
    //   handleClose();
    // }
    function handleRating(){
      if(rating === 0) return toast.error('please rate before submitting.');
      socket.emit('to-dev',{rating,suggestion:value});
      toast.success('Thank you for your feedback, it matters a lot!',{duration:5000});
      handleClose();
    }
    function handleRatingDismissed(){
      socket.emit('to-dev',{rating:0});
      localStorage.setItem('ratingDismissed2',"true");
      setIsRatingDismissed(true);
    }
    if (user?._id && !isNotified || ((!isRated && !isRatingDismissed) && user?._id === "6a57a6bf4a5745965fcc1a85"))
      return (
        <div className="z-999 fixed top-0 left-0 flex h-full w-full items-center justify-center backdrop-brightness-50">
          {!isNotified && user?._id && (
            <div className="text-sm flex flex-col w-[90%] lg:w-1/3 max-w-md rounded-2xl bg-(--card) p-5 shadow-md">
              <div className=" mb-5 border-b border-(--border) pb-3 text-center">
                <h2 className="text-lg font-bold text-(--foreground)">
                  Screen will stay awake
                </h2>
              </div>
              <p className="rounded-xl border border-amber-500/20 bg-(--card-hover) p-4 ">
                Your screen will stay on during the{" "}
                <strong>class recording</strong>, even if your phone’s screen
                timeout is set to turn it off, as long as your browser is open.
              </p>
              <button
                onClick={() => {
                  localStorage.setItem("isNotified2", "true");
                  setIsNotified(true);
                }}
                className="bg-(--primary) px-2 py-2 w-full rounded-md text-white mt-2 mx-auto"
              >
                close
              </button>
            </div>
          )}
          {!isRated &&
            !isRatingDismissed &&
            user?._id === "6a57a6bf4a5745965fcc1a85" &&
            isNotified && (
              <div className="flex w-[90%] max-w-md flex-col rounded-2xl bg-(--card) p-5 shadow-md">
                {/* Heading */}
                <div className="mb-5 border-b border-(--border) pb-3 text-center">
                  <h2 className="text-xl font-bold text-(--foreground)">
                    Rate your experience
                  </h2>
                  <p className="mt-1 text-[0.65rem] text-amber-800">
                    Your feedback helps us improve.
                  </p>
                </div>

                {/* Question Card */}
                <div className="rounded-xl border border-amber-500/20 bg-(--card-hover) p-4 flex flex-col justify-center items-center">
                  <div className="flex gap-3 justify-center">
                    {Array.from({ length: 5 }).map((el, i) => {
                      return rating > i ? (
                        <FaStar
                          key={i}
                          onClick={() => setRating(i + 1)}
                          className="text-yellow-500"
                        />
                      ) : (
                        <FaRegStar key={i} onClick={() => setRating(i + 1)} />
                      );
                    })}
                  </div>
                  {rating !== 0 && (
                    <p className="text-xs mt-3 font-bold">
                      {ratingText[rating - 1]}
                    </p>
                  )}
                </div>

                {rating > 0 && (
                  <div className="mt-5 ">
                    <p className="text-xs text-gray-800 mb-1">
                      Anything you want to say ?{" "}
                      <span className="text-[0.60rem] text-gray-600">
                        (optional, but appreciated)
                      </span>
                    </p>
                    <textarea
                      onChange={(e) => setValue(e.target.value)}
                      rows={2}
                      name=""
                      id=""
                      className="w-full border p-2 text-xs placeholder:text-[0.60rem] duration-300 transition-all ease-in-out outline-none focus:border-blue-500 rounded-sm border-gray-500"
                      placeholder="any bug, error, improvement, compliment etc"
                    ></textarea>
                  </div>
                )}

                <p className="text-[0.65rem] mt-2 text-gray-600">
                  if you have already rated then we are sorry for the
                  incovenience, but it looks like we haven’t received any
                  previous rating data.
                </p>

                {/* Actions */}
                <div className="mt-5 flex gap-3">
                  <button
                    onClick={handleRatingDismissed}
                    className="flex-1 shadow-(--shadow-md) rounded-md  px-4 py-2 text-sm font-medium border bg-amber-50 border-amber-300/30 text-amber-800"
                  >
                    Later
                  </button>
                  <button
                    onClick={handleRating}
                    className="flex-1 shadow-(--shadow-md) rounded-md bg-(image:--gradient-primary) px-4 py-2 text-sm font-medium text-white"
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
        </div>
      );
}

export default Notification
