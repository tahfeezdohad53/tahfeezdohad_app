'use client';

import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef } from "react";
import useCheckIn from "../hooks/useCheckIn";
import toast from "react-hot-toast";
import useCheckOut from "../hooks/useCheckOut";

function QRScanner({close,type}) {
    const mutate = useCheckIn();
    const checkOutMutate = useCheckOut();
    const processing = useRef(false);
    useEffect(() => {
        const scanner = new Html5Qrcode('qr');
        // let processing = false;
        scanner.start(
          { facingMode: "environment" },
          { fps: 30, qrbox: { width: 300, height: 500 } },
          async (decodedText) => {
            if(processing.current) return;
            processing.current = true;
            if (type === "checkIn") {
              try {
                await mutate.mutateAsync({ batch: decodedText });
                await scanner.stop();
              } catch (err) {
                //  toast.error("failed to check in, try again!");
              } finally {
                close();
                processing.current = false;
              }
            }
            if (type === "checkOut") {
              try {
                await checkOutMutate.mutateAsync();
                await scanner.stop();
              } catch (err) {
                // toast.error('failed to check out');
              }finally{
                processing.current = false;
              }
            }
          },
          () => {
            console.log("try again");
          },
        );
    },[])
    return (
        <div className="z-999999999  fixed w-full h-screen bg-black top-0 left-0">
            <div className="w-full h-full" id="qr">

            </div>
        </div>
    )
}

export default QRScanner
