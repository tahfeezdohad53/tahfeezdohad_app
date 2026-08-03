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
        const isRated = localStorage.getItem('isRated');
        setIsRated(isRated === 'true' ? true : false);
        const isRatingDismissed = localStorage.getItem('ratingDismissed');
        setIsRatingDismissed(isRatingDismissed === 'true' ? true : false);
    },[])

    function handleClose(){
        setIsRated(true);
        localStorage.setItem('isRated','true');
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
      localStorage.setItem('ratingDismissed',"true");
      setIsRatingDismissed(true);
    }
    if ((!isRated && !isRatingDismissed) && user?._id === "6a57a6bf4a5745965fcc1a85")
      return (
        <div className="z-999 fixed top-0 left-0 flex h-full w-full items-center justify-center backdrop-brightness-50">
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

            {rating > 0 && <div className="mt-5 ">
              <p className="text-xs text-gray-800 mb-1">
                Anything you want to say ?{" "}
                <span className="text-[0.60rem] text-gray-600">(optional, but appreciated)</span>
              </p>
              <textarea
                onChange={(e) => setValue(e.target.value)}
                rows={2}
                name=""
                id=""
                className="w-full border p-2 text-xs placeholder:text-[0.60rem] duration-300 transition-all ease-in-out outline-none focus:border-blue-500 rounded-sm border-gray-500"
                placeholder="any bug, error, improvement, compliment etc"
              ></textarea>
            </div>}

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
        </div>
      );
}

export default Notification
