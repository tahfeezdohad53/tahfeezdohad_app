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
          { fps: 30,qrbox:{width:300,height:400}},
          async (decodedText) => {
            if(processing.current) return;
            processing.current = true;
            if (type === "checkIn") {
              try {
                await mutate.mutateAsync({ batch: decodedText });
                await scanner.stop();
                localStorage.setItem('checkedInBatch','offline');
                // let batch;
                // if(decodedText === 'yaqoot_mardo') batch = 'yaqoot rijaal';
                // if(decodedText === 'yaqoot_bairo') batch = 'yaqoot nisaa';
                // if(decodedText === 'kibaar') batch = 'kibaar';
                // if(decodedText === 'sigaar') batch = 'sigaar';
                // if(decodedText === 'atfaal') batch = 'baneen banaat';
                // if(decodedText === 'taheri_hall') batch = 'taaheri hall';
                // const utterance = new SpeechSynthesisUtterance(`checked in ${batch || ''}`)
                // utterance.lang = "en-UK";
                // speechSynthesis.speak(utterance);
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
                // const utterance = new SpeechSynthesisUtterance('checked out');
                // utterance.lang = 'hi-IN';
                // speechSynthesis.speak(utterance);
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
        <div className=" z-999999 fixed w-full h-3/4 flex justify-center items-center top-1/2 left-1/2 -translate-1/2">
            <div className=" w-full h-full rounded-md overflow-hidden" id="qr">

            </div>
        </div>
    )
}

export default QRScanner
