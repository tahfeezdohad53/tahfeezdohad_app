"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useVideoCallContext } from "../providers/VideoCallProvider";
import { useCallingFn } from "../socket-listeners/Socket";
import { useSession } from "next-auth/react";
import Select from "react-select";
import { FiBookOpen, FiFileText, FiEdit3 } from "react-icons/fi";

import {
  FiMic,
  FiMicOff,
  FiVideo,
  FiVideoOff,
  FiPhoneOff,
  FiCheck,
} from "react-icons/fi";
import { IoIosCall } from "react-icons/io";
import { MdCallEnd } from "react-icons/md";
import Draggable from "react-draggable";
import { useUser } from "../providers/UserProvider";
import { BsExclamationCircle, BsFillRecordCircleFill } from "react-icons/bs";
import Modal from "../Modal";
import { FaGraduationCap, FaRegLightbulb } from "react-icons/fa";
import CustomSelect from "../Select";
import { useAppProvider } from "../providers/AppProvider";
import toast from "react-hot-toast";
import axios from "axios";
import { HiXMark } from "react-icons/hi2";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { formatName } from "@/helpers";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { api } from "@/lib/axios";
function VideoCallUI() {
  const { user } = useUser();
  const videoRef = useRef(null);
  const {
    localVideoRef,
    setShowCallControls,
    showCallControls,
    localMedia,
    isCalling,
    isIncoming,
    isInCall,
    callerId,
    remoteVideoRef,
    setVideoCallSeconds,
    videoCallSeconds,
    peerConnection,
  } = useVideoCallContext();
  const { dummyAnsCall, acceptCall, endCall } = useCallingFn();
  const [isMute, setIsMute] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const dragRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [showFix, setShowFix] = useState(false);
  const [networkQuality,setNetworkQuality] = useState(false);
  useEffect(() => {
    if (!isInCall) return;
    const interval = setInterval(() => {
      setVideoCallSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isInCall]);

  const previousStats = useRef({
    packetsLost: 0,
    packetsReceived: 0,
  });

  const getNetworkQuality = useCallback(async () => {
    if (!peerConnection.current) return;

    const stats = await peerConnection.current.getStats();

    let rtt = 0;
    let packetsLost = 0;
    let packetsReceived = 0;

    stats.forEach((report) => {
      if (
        report.type === "candidate-pair" &&
        report.state === "succeeded" &&
        report.nominated
      ) {
        rtt = (report.currentRoundTripTime || 0) * 1000;
      }

      if (
        report.type === "inbound-rtp" &&
        (report.kind === "audio" || report.kind === "video")
      ) {
        packetsLost += report.packetsLost || 0;
        packetsReceived += report.packetsReceived || 0;
      }
    });

    // Calculate only the packets lost since the previous check
    const lostDelta = packetsLost - previousStats.current.packetsLost;

    const receivedDelta =
      packetsReceived - previousStats.current.packetsReceived;

    previousStats.current = {
      packetsLost,
      packetsReceived,
    };

    const totalPackets = lostDelta + receivedDelta;

    const loss = totalPackets > 0 ? (lostDelta / totalPackets) * 100 : 0;

    if (rtt > 500 || loss > 5) {
      setNetworkQuality("critical");
    } else if (rtt > 250 || loss > 2) {
      setNetworkQuality("poor");
    } else {
      setNetworkQuality("good");
    }
  }, [peerConnection]);

  useEffect(() => {
    let interval = setInterval(() => {
      getNetworkQuality();
    }, 5000);

    return () => clearInterval(interval);
  },[getNetworkQuality])

  const formatTime = (time) => {
    const hours = String(Math.floor(time / 3600)).padStart(2, "0");
    const mins = String(Math.floor((time % 3600) / 60)).padStart(2, "0");
    const secs = String(time % 60).padStart(2, "0");

    return `${hours}:${mins}:${secs}`;
  };
  useEffect(() => {
    let stream;

    async function getMedia() {
      if (isCalling) return;

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            frameRate: { ideal: 60 },
          },
          audio: {
            sampleRate: 48000,
            channelCount: 2,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.log(err);
      }
    }

    getMedia();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [isCalling]);

  async function handleFix() {
    try {
      const m = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 60 },
          facingMode: "user",
        },
        audio: {
          sampleRate: 48000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      const pc = new RTCPeerConnection();
      localVideoRef.current.srcObject = m;
      const sender = peerConnection.current
        ?.getSenders()
        .find((s) => s.track?.kind === "audio");
      await sender.replaceTrack(m.getAudioTracks()[0]);
      const videoSender = peerConnection.current
        ?.getSenders()
        .find((s) => s.track?.kind === "video");
      await videoSender.replaceTrack(m.getVideoTracks()[0]);
      localMedia.current.getTracks().forEach((track) => track.stop());
      localMedia.current = m;
      setIsMute(false);
      setIsVideoOff(false);
      setShowFix(false);
      toast.success('fixed video call');
    } catch (error) {
      toast.error("failed to fix");
    }
  }

  // if(isAdminJoined)return <div className="fixed h-[90%] w-full inset-0 z-10000 lg:flex">
  //   <video ref={adminMediaOfferRefOne} src="" className="bg-black w-full h-1/2 lg:h-full object-contain" ></video>
  //   <video ref={adminMediaOfferReftwo} src="" className="bg-gray-500 w-full h-1/2 lg:h-full object-contain" ></video>
  // </div>;
  return (
    <>
      {showCallControls && (
        <div className="h-[12%] w-full fixed z-9999 bottom-0 left-0 bg-black backdrop-blur-md border-t border-white/10 flex items-center justify-between px-6">
          {/* LEFT — Timer */}
          <div className="flex-1 flex items-center">
            <div
              className={`${
                !isInCall && "opacity-0"
              } text-white text-lg font-semibold tracking-wide`}
            >
              {formatTime(videoCallSeconds)}
            </div>
          </div>

          {/* CENTER — Controls + Network */}
          <div className="flex flex-col items-center justify-center">
            {/* Controls */}
            <div className="flex items-center gap-5">
              {/* Mute */}
              <button
                onClick={() => {
                  setIsMute(!isMute);

                  localMedia.current
                    .getAudioTracks()
                    .forEach((track) => (track.enabled = !track.enabled));
                }}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 flex items-center justify-center text-white shadow-lg active:scale-95"
              >
                {!isMute && <FiMic size={20} />}
                {isMute && <FiMicOff size={20} />}
              </button>

              {/* Camera */}
              <button
                onClick={() => {
                  setIsVideoOff(!isVideoOff);

                  const currentState = !isVideoOff;

                  localMedia.current
                    .getVideoTracks()
                    .forEach((track) => (track.enabled = !currentState));
                }}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 flex items-center justify-center text-white shadow-lg active:scale-95"
              >
                {!isVideoOff && <FiVideo size={20} />}
                {isVideoOff && <FiVideoOff size={20} />}
              </button>

              {/* End Call */}
              <button
                onClick={endCall}
                className="w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 transition-all duration-200 flex items-center justify-center text-white shadow-xl active:scale-95"
              >
                <MdCallEnd />
              </button>

              {/* Accept Call */}
              {!isCalling && !isInCall && (
                <button
                  onClick={() => acceptCall(user._id, callerId)}
                  className="w-10 h-10 rounded-full bg-green-500 hover:bg-green-600 transition-all duration-200 flex items-center justify-center text-white shadow-xl active:scale-95"
                >
                  <IoIosCall />
                </button>
              )}
            </div>

            {/* Network Status */}
            {isInCall && (
              <div className="mt-1.5 absolute left-1/2 -translate-x-1/2 bottom-1 text-[0.65rem] text-gray-300 flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    networkQuality === "good"
                      ? "bg-green-500"
                      : networkQuality === "poor"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                />

                <span>
                  {networkQuality === "good"
                    ? "Good connection"
                    : networkQuality === "poor"
                      ? "Poor connection"
                      : "Very poor connection"}
                </span>
              </div>
            )}
          </div>

          {/* RIGHT — Lap */}
          <div className="flex-1 flex justify-end">
            {user?.role !== "student" && isInCall && (
              <button
                onClick={() => setShowModal(!showModal)}
                className="text-white flex bg-gray-800 px-4 py-2 items-center gap-2 text-xs hover:bg-gray-700 rounded-md duration-300 ease-in-out transition-all"
              >
                Lap
                <BsFillRecordCircleFill />
              </button>
            )}
          </div>
        </div>
      )}
      <div className="fixed h-[88%] w-full inset-0 z-10000">
        {(isCalling || isIncoming) && !isInCall && (
          <>
            {isCalling && !isIncoming && (
              <video
                // onPlay={()=>setShowCallControls(true)}
                ref={localVideoRef}
                autoPlay
                muted
                className="h-full w-full object-cover lg:object-contain bg-black bg-cover bg-center z-99999"
              />
            )}
            {!isCalling && isIncoming && (
              <video
                onPlay={() => setShowCallControls(true)}
                muted
                ref={localVideoRef}
                autoPlay
                className="w-full h-full object-cover lg:object-contain bg-black bg-cover bg-center"
              ></video>
            )}
          </>
        )}
        {(isCalling || isIncoming) && isInCall && (
          <>
            {showModal && <SelectStudent onclose={() => setShowModal(false)} />}
            <div className="fixed top-3 left-3 z-99 bg-black rounded-md">
              <HiOutlineDotsVertical
                onClick={() => setShowFix(!showFix)}
                className="text-white text-2xl"
              />
              {showFix && (
                <button
                  className="absolute top-[150%] left-1 bg-(--primary) text-white px-6 py-1 rounded-md"
                  onClick={handleFix}
                >
                  Fix
                </button>
              )}
            </div>
            <div onClick={() => setShowModal(false)} className="h-full w-full">
              <div className="absolute h-full w-full">
                <video
                  playsInline
                  className="h-full  w-full object-cover lg:object-contain bg-black  z-99999"
                  ref={remoteVideoRef}
                ></video>
              </div>
              <Draggable nodeRef={dragRef}>
                <div
                  ref={dragRef}
                  className="absolute top-3 right-3 rounded-lg bg-black border border-black/20 overflow-auto shadow-2xl w-30 h-40 z-999999"
                >
                  <video
                    ref={localVideoRef}
                    muted
                    autoPlay
                    className="h-full w-full object-cover lg:object-contain z-99999"
                  ></video>
                </div>
              </Draggable>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default VideoCallUI;

function SelectStudent({ onclose }) {
  const { students } = useAppProvider();
  const [student, setStudent] = useState({ id: "", name: "" });
  const formattedName = formatName(student.name);
  const [error, setError] = useState(false);
  const [classType,setClassType] = useState('');
  const {
    isLap,
    setIsLap,
    videoCallSeconds,
    setVideoCallSeconds,
    onlineClassBlob,
    recorderRef,
    setOnlineClassBlob,
    setOnlineClassBlobUrl,
  } = useVideoCallContext();
  const formatedStudents = students?.map((el) => {
    // const name = el.name.split(' ').filter((el,i) => i !== 1 ? true : false).join(' ');
    // const name = el.name.split(' ').filter(el => el.toLowerCase() !== 'bhai').join(' ');
    return { label: el.name, value: el._id };
  });

  useEffect(() => {
    async function submitVideoCallRecording() {
      if (!student.id) return setError(true);
      if(!classType) return toast.error('Please select class type');
      const url = URL.createObjectURL(onlineClassBlob);
      const audio = new Audio(url);
      let dur;

      await new Promise((resolve, reject) => {
        audio.onloadedmetadata = () => {
          dur = audio.duration / 60;
          resolve();
        };
        audio.onerror = () => {
          dur = 1;
          reject();
        };
      });

      onclose();
      setOnlineClassBlob(null);
      setVideoCallSeconds(0);
      setOnlineClassBlobUrl("");

      const toastId = "uploading";

      toast.loading("Upload starting...", { id: toastId });

      let data;

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/recording/signedToken/${formattedName}`,
          { withCredentials: true },
        );
        data = response.data;
      } catch (err) {
        console.log(err);
        toast.error("signed token failed!", { id: toastId });
        setIsLap((val) => !val);
        return;
      }

      try {
        await axios.put(data.signedUrl, onlineClassBlob, {
          headers: {
            "Content-Type": "audio/webm",
          },
          onUploadProgress: (progress) => {
            const percent = Math.round(
              (progress.loaded * 100) / progress.total,
            );

            toast.loading(`Uploading... ${percent}%`, {
              id: toastId,
            });
          },
        });
      } catch (error) {
        console.log(err);
        toast.error("Upload failed!", { id: toastId });
        alert(
          `UPLOAD FAILED\n\n` +
            `Message: ${error.message}\n` +
            `Code: ${error.code}\n` +
            `Status: ${error.response?.status}\n` +
            `Status Text: ${error.response?.statusText}\n` +
            `Response: ${JSON.stringify(error.response?.data)}\n` +
            "please take a screenshot and send to your supervisor",
        );
        setIsLap((val) => !val);
        return;
      }

      try {
        toast.loading("almost done...", { id: toastId });
        await api.post(
          `/recording/create/${student.id}`,
          {
            isOnline: true,
            url: data.url,
            duration: dur,
            slot:classType,
          }
        );
      } catch (err) {
        console.log(err);
        toast.error("entry failed!", { id: toastId });
        setIsLap((val) => !val);
        return;
      }

      URL.revokeObjectURL(url);
      toast.success("recording submitted!", { id: toastId });
      setIsLap((val) => !val);
    }
    if (onlineClassBlob) submitVideoCallRecording();
  }, [onlineClassBlob, student.id,classType]);

  return (
    <div className="fixed overflow-auto h-full lg:w-1/2 z-999999999999999 backdrop-opacity-0  bg-(--card) p-10 w-full flex flex-col gap-6">
      {/* Header */}
      <button className="absolute right-3 top-3" onClick={onclose}>
        <HiXMark />
      </button>
      <div className="flex items-center gap-4">
        <div className="flex p-3 items-center justify-center rounded-full bg-amber-100">
          <FaGraduationCap className="text-3xl text-amber-700" />
        </div>

        <div>
          <h2 className="lg:text-2xl text-lg font-bold text-amber-950">
            Select Student
          </h2>

          <p className="mt-1 text-gray-500 text-xs lg:text-sm">
            Choose a student from the list
          </p>
        </div>
      </div>

      {/* Select */}
      <div>
        <Select
          options={formatedStudents}
          onChange={(e) => {
            setStudent({ id: e.value, name: e.label });
            setError(false);
          }}
        />
        {error && !student.id && (
          <p className="text-xs text-red-500 mt-1 font-bold">
            please select a student
          </p>
        )}
      </div>
      <div className="w-full mt-9">
                <p className="text-xl font-bold text-(--text) mb-5">
                  Select Class Type
                </p>
      
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      label: "Jadeed",
                      value: "jd",
                      icon: <FiBookOpen />,
                    },
                    {
                      label: "Juz/Mur",
                      value: "jz-mj",
                      icon: <FiBookOpen />,
                    },
                    {
                      label: "Muraja'ah",
                      value: "mj",
                      icon: <FiBookOpen />,
                    },
                    {
                      label: "Juzhaali",
                      value: "jz",
                      icon: <FiBookOpen />,
                    },
                    {
                      label: "Tasmee 1",
                      value: "t1",
                      icon: <FiFileText />,
                    },
                    {
                      label: "Tasmee 2",
                      value: "t2",
                      icon: <FiFileText />,
                    },
                    {
                      label: "Tasmee 3",
                      value: "t3",
                      icon: <FiFileText />,
                    },
                    {
                      label: "Tasmee 4",
                      value: "t4",
                      icon: <FiFileText />,
                    },
                    {
                      label: "Tasmee 5",
                      value: "t5",
                      icon: <FiFileText />,
                    },
                    {
                      label: "Tamreen",
                      value: "tm",
                      icon: <FiEdit3 />,
                    },
                  ].map(({ label, value, icon }) => {
                    const selected = classType === value;
      
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setClassType(value)}
                        className={`
                  relative
                  flex
                  items-center
                  gap-2
                  py-1
                  px-4
                  rounded-xl
                  border
                  
                  text-left
                  transition-all
                  ${
                    selected
                      ? "border-transparent shadow-md bg-(--bg-tertiary)/40"
                      : "border-(--border) hover:shadow-md bg-(--card)"
                  }
                `}
                      >
                        {/* Icon */}
                        <div
                          className={`
                    flex
                    items-center
                    justify-center
                    w-11
                    h-11
                    rounded-xl
                    shrink-0
                    text-xl
                    ${selected ? "text-(--primary)" : "text-(--text-secondary)"}
                  `}
                        >
                          {icon}
                        </div>
      
                        {/* Label */}
                        <span className="text-sm sm:text-base font-semibold text-(--text)">
                          {label}
                        </span>
      
                        {/* Selected Checkmark */}
                        {selected && (
                          <div className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 rounded-full bg-(--primary) text-white shadow-md">
                            <FiCheck className="text-base" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
      
                {/* Info */}
                <div className="flex items-center gap-3 mt-5 px-4 py-4 rounded-2xl bg-(--bg-tertiary)/70">
                  <BsExclamationCircle className="text-lg text-(--primary) shrink-0" />
      
                  <p className="text-xs text-(--text-secondary)">
                    Please select{" "}
                    <span className="font-semibold text-(--text)">Jadeed</span> if you
                    are taking a full class.
                  </p>
                </div>
              </div>
      <button
        onClick={() => {
          if (student.id) recorderRef?.current?.stop?.();
        }}
        className="bg-(image:--gradient-primary) text-white p-2 rounded-md"
      >
        Submit Recording
      </button>
    </div>
  );
}
