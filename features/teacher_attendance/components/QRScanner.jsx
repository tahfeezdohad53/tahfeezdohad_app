'use client';

import { Html5Qrcode } from "html5-qrcode";
import { useEffect } from "react";
import useCheckIn from "../hooks/useCheckIn";
import toast from "react-hot-toast";
import useCheckOut from "../hooks/useCheckOut";

function QRScanner({close,type}) {
    const mutate = useCheckIn();
    const checkOutMutate = useCheckOut();

    useEffect(() => {
        const scanner = new Html5Qrcode('qr');

        scanner.start(
          { facingMode: "environment" },
          { fps: 30, qrbox: { width: 300, height: 600 } },
          async (decodedText) => {
            if (type === "checkIn") {
              try {
                await mutate.mutateAsync({ batch: decodedText });
                await scanner.stop();
              } catch (err) {
                //  toast.error("failed to check in, try again!");
              } finally {
                close();
              }
            }
            if (type === "checkOut") {
              try {
                await checkOutMutate.mutateAsync();
                await scanner.stop();
              } catch (err) {
                // toast.error('failed to check out');
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
            <div className="w-full h-1/2" id="qr">

            </div>
        </div>
    )
}

export default QRScanner
