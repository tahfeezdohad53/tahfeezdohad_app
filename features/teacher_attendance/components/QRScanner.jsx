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
      alert('checkout qr open');
    },[])
    useEffect(() => {
        const scanner = new Html5Qrcode('qr');
        // let processing = false;
        scanner.start(
          { facingMode: "environment" },
          { fps: 30,qrbox:{width:300,height:400}},
          async (decodedText) => {
            if(processing.current) return;
            processing.current = true;

            try{
              if(type === 'checkIn') {
                alert('checking in...');
                await mutate.mutateAsync({ batch: decodedText });
                localStorage.setItem("checkedInBatch", "offline");
                alert('checkin');
              }
              if(type === 'checkOut') {
                alert('checking out...')
                await checkOutMutate.mutateAsync();
                alert('checkout');
              }
              close();
              await scanner.stop();
            }catch(err){

            }finally{
              processing.current = false;
            }
          },
          () => {
            // console.log("try again");
          },
        );
    },[])
    return (
        <div className=" z-999999 fixed w-full h-3/4 flex justify-center items-center top-1/2 left-1/2 -translate-1/2">
            <div className=" w-full h-full rounded-md overflow-hidden" id="qr">

            </div>
        </div>
    )
}

export default QRScanner
