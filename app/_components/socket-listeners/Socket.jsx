"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import { useSocketContext } from "@/app/_components/providers/SocketProvider";
import { useVideoCallContext } from "../providers/VideoCallProvider";
import { useUser } from "../providers/UserProvider";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";

const Context = createContext(null);

export function CallingFnProvider({ children }) {
  const { socket } = useSocketContext();
  const {
    isIncoming,
    setShowCallControls,
    setVideoCallSeconds,
    setOnlineClassBlobUrlSize,
    setOnlineClassBlob,
    setOnlineClassBlobUrl,
    localMedia,
    remoteMedia,
    setRemoteMedia,
    remoteVideoRef,
    isCalling,
    callingTo,
    setCallingTo,
    localVideoRef,
    setIsCalling,
    setIsIncoming,
    isInCall,
    setIsInCall,
    setCallerId,
    callerId,
    remoteOffer,
    setRemoteOffer,
  } = useVideoCallContext();
  const { user } = useUser();
  const querClient = useQueryClient();
  const { peerConnection } = useVideoCallContext();
  const candidates = useRef([]);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const targetUserRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  async function turn() {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_URL}/turn-credentials`,
      { withCredentials: true },
    );
    peerConnection.current = new RTCPeerConnection(res.data);
    peerConnection.current.ontrack = (event) => {
      const stream = event.streams[0];
      setRemoteMedia(stream);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
        remoteVideoRef.current.play().catch((err) => console.log(err));
      }
    };

    peerConnection.current.onicecandidate = ({ candidate }) => {
      if (candidate) {
        socket.emit("ice-candidate", {
          to: targetUserRef.current,
          candidate,
        });
      }
    };

    peerConnection.current.onconnectionstatechange = async () => {
      console.log("connection state: ", peerConnection.current.connectionState);
      if (!isCalling) return;
      if (peerConnection.current.connectionState === "failed") {
        peerConnection.current.restartIce();
        const offer = await peerConnection.current.createOffer({
          iceRestart: true,
        });

        await peerConnection.current.setLocalDescription(offer);

        socket.emit("ice-restart-offer", { offer, to: callingTo });
      }
    };
  }
  async function endCall() {
    setIsCalling(false);
    setIsIncoming(false);
    setIsInCall(false);
    setShowCallControls(false);
    if (user?.role === "student") setVideoCallSeconds(0);
    if (user?.role !== "student" && recorderRef.current) {
      recorderRef.current.stop();
      if (pathname.includes("onlineclass")) {
        const lastIndex = pathname.lastIndexOf("/");
        const refactoredPathname = pathname.slice(0, lastIndex);
        router.replace(`${refactoredPathname}/${targetUserRef.current}`, {
          scroll: false,
        });
      } else {
        const firstIndex = pathname.indexOf("/");
        const refactoredPathname = pathname.slice(0, firstIndex);
        router.replace(
          `${refactoredPathname}/onlineclass/${targetUserRef.current}`,
          { scroll: false },
        );
      }
    } else {
      // window.location.reload();
    }
    if (localMedia.current) {
      localMedia.current.getTracks().forEach((track) => track.stop());
    }
    socket.emit("end-call", { to: targetUserRef.current });
    await turn();
  }

  useEffect(() => {
    if (!isInCall) return;
    if (user?.role === "student") return;
    if (recorderRef?.current?.state === "recording") return;
    if (!localMedia.current || !remoteMedia) return;
    const audioContext = new AudioContext();
    const destination = audioContext.createMediaStreamDestination();
    const localAudiotracks = new MediaStream(
      localMedia.current.getAudioTracks(),
    );
    const localSource = audioContext.createMediaStreamSource(localAudiotracks);
    const remoteAudiotracks = new MediaStream(remoteMedia.getAudioTracks());
    const remoteSource =
      audioContext.createMediaStreamSource(remoteAudiotracks);
    localSource.connect(destination);
    remoteSource.connect(destination);
    recorderRef.current = new MediaRecorder(destination.stream, {
      mimeType: "audio/webm;codecs=opus",
      audioBitsPerSecond: 256000,
    });

    recorderRef.current.ondataavailable = (event) => {
      chunksRef.current.push(event.data);
    };
    recorderRef.current.onstop = (event) => {
      const blob = new Blob(chunksRef.current, {
        type: "audio/webm",
      });
      setOnlineClassBlob(blob);
      setOnlineClassBlobUrlSize(Number((blob.size / 1024 / 1024).toFixed(1)));
      const url = URL.createObjectURL(blob);
      setOnlineClassBlobUrl(url);
      chunksRef.current = [];
    };
    recorderRef.current.start();
  }, [isInCall, user?.role, localMedia, remoteMedia]);

  /* eslint-disable */
  useEffect(() => {
    if (!socket) return;

    // socket.on("connect", () => {
    //   console.log("CONNECT", socket.id);
    // });

    socket.on("disconnect", (reason) => {
      console.log("DISCONNECT", socket.id, reason);
    });

    // socket.io.engine.on("packet", (packet) => {
    //   if (packet.type === "ping") {
    //     console.log("PING", socket.id);
    //   }
    // });

    turn();
  }, [socket]);
  // async function turn() {
  //   const res = await axios.get(
  //     `${process.env.NEXT_PUBLIC_URL}/turn-credentials`,
  //     { withCredentials: true },
  //   );
  //   peerConnection.current = new RTCPeerConnection(res.data);
  //   peerConnection.current.ontrack = (event) => {
  //     const stream = event.streams[0];
  //     setRemoteMedia(stream);
  //     if (remoteVideoRef.current) {
  //       remoteVideoRef.current.srcObject = stream;
  //       remoteVideoRef.current.play().catch((err) => console.log(err));
  //     }
  //   };

  //   peerConnection.current.onicecandidate = ({ candidate }) => {
  //     if (candidate) {
  //       socket.emit("ice-candidate", {
  //         to: targetUserRef.current,
  //         candidate,
  //       });
  //     }
  //   };
  // }
  async function startCall(receiverId, callerId) {
    // const res = await axios.get(
    //   `${process.env.NEXT_PUBLIC_URL}/turn-credentials`,
    //   { withCredentials: true },
    // );
    // console.log(res.data)
    // peerConnection.current = new RTCPeerConnection(res.data);
    // await turn();
    setIsCalling(true);
    setCallingTo(receiverId);
    targetUserRef.current = receiverId;
    localMedia.current = await navigator.mediaDevices.getUserMedia({
      video: {
  width: { ideal: 1920 },
  height: { ideal: 1080 },
  frameRate: { ideal: 60 },
  facingMode:'user',
},
      audio: {
        sampleRate: 48000,
        channelCount: 2,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });
    localVideoRef.current.srcObject = localMedia.current;

    localMedia.current
      .getTracks()
      .forEach((track) =>
        peerConnection.current.addTrack(track, localMedia.current),
      );
    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    setShowCallControls(true);

    await new Promise((res) =>
      setTimeout(() => {
        res();
      }, 600),
    );
    socket.emit("incoming-call", { to: receiverId, from: callerId, offer });
  }

  async function acceptCall(receiverId, callerId) {
    // const res = await axios.get(
    //   `${process.env.NEXT_PUBLIC_URL}/turn-credentials`,
    //   { withCredentials: true },
    // );
    // peerConnection.current = new RTCPeerConnection(res.data);
    setIsInCall(true);
    setOnlineClassBlob(null);
    setOnlineClassBlobUrl("");
    await peerConnection.current.setRemoteDescription(
      new RTCSessionDescription(remoteOffer),
    );
    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);

    if (candidates.current.length !== 0)
      for (const candidate of candidates.current) {
        peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    candidates.current = [];
    await new Promise((res) =>
      setTimeout(() => {
        res();
      }, 600),
    );
    socket.emit("call-accepted", { to: callerId, from: receiverId, answer });
  }

  async function dummyStartCall(callerId) {
    socket.emit("incoming-call", { to: callerId, from: callerId });
  }
  async function dummyAnsCall(callerId) {
    socket.emit("call-accepted", { to: callerId, from: callerId });
  }

  useEffect(() => {
    if (!localVideoRef.current) return;
    localVideoRef.current.srcObject = localMedia.current;
  }, [isInCall]);

  useEffect(() => {
    if (!socket) return;
    socket.on("incoming-call", async ({ caller, offer }) => {
      if (isInCall || isIncoming || isCalling)
        return socket.emit("line-busy", { to: caller });
      // await turn();

      setIsIncoming(true);
      setCallerId(caller);
      targetUserRef.current = caller;

      setRemoteOffer(offer);
      localMedia.current = await navigator.mediaDevices.getUserMedia({
        video: {
  width: { ideal: 1920 },
  height: { ideal: 1080 },
  frameRate: { ideal: 60 },
  facingMode:'user'
},
        audio: {
          sampleRate: 48000,
          channelCount: 2,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      localMedia.current
        .getTracks()
        .forEach((track) =>
          peerConnection.current.addTrack(track, localMedia.current),
        );
      localVideoRef.current.srcObject = localMedia.current;
    });

    socket.on("call-accepted", async ({ caller, answer }) => {
      setIsInCall(true);

      // localVideoRef.current.srcObject = localMedia.current;
      // localVideoRef.current.play();
      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(answer),
      );
      console.log(candidates.current);
      for (const candidate of candidates.current) {
        peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
      candidates.current = [];
    });

    socket.on("line-busy", () => {
      toast.error("The person you are trying to reach is on another call");
    });

    socket.on("not-online", () => {
      endCall();
      toast.error("The person you are trying to reach is offline");
    });

    socket.on("ice-restart-offer", async ({ offer }) => {
      console.log("ice restart offer: ", offer);
      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(offer),
      );
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      console.log("ice restart offer candidates", candidates.current);
      if (candidates.current.length !== 0)
        for (const candidate of candidates.current) {
          peerConnection.current.addIceCandidate(
            new RTCIceCandidate(candidate),
          );
        }
      candidates.current = [];
      socket.emit("ice-restart-answer", { answer, to: callerId });
    });

    socket.on("ice-restart-answer", async ({ answer }) => {
      console.log("ice restart answer", answer);
      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(answer),
      );
      console.log("ice restart answer candidates", candidates.current);
      if (candidates.current.length !== 0)
        for (const candidate of candidates.current) {
          peerConnection.current.addIceCandidate(
            new RTCIceCandidate(candidate),
          );
        }
      candidates.current = [];
    });
    socket.on("ice-candidate", async ({ candidate }) => {
      if (!peerConnection.current) return;
      if (peerConnection.current.remoteDescription) {
        peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      } else {
        candidates.current.push(candidate);
      }
    });
    socket.on("online", async ({ name, role, id }) => {
      if (role === "teacher") {
        querClient.setQueriesData({ queryKey: ["myTeachers"] }, (data) => {
          console.log(data);
          return data?.map((el) => {
            if (el._id !== id) return el;
            else return { ...el, status: "online" };
          });
        });
        querClient.setQueriesData({ queryKey: ["gurfahData"] }, (data) => {
          if (data?.user?._id === id)
            return { user: { ...data?.user, status: "online" } };
        });
      }

      if (role === "student") {
        querClient.setQueriesData({ queryKey: ["myStudents"] }, (data) => {
          console.log("students data online");
          console.log(data);
          const updatedData = data?.map((el) => {
            if (el._id !== id) return el;
            else return { ...el, status: "online" };
          });
          console.log("after");
          console.log(updatedData);
          return updatedData;
        });

        querClient.setQueriesData({ queryKey: ["gurfahData"] }, (data) => {
          console.log("runnning");

          if (data?.user?._id === id) {
            console.log("running inside");
            return { user: { ...data?.user, status: "online" } };
          }
        });
      }
    });
    socket.on("offline", async ({ name, role, id }) => {
      if (role === "teacher") {
        querClient.setQueryData(["myTeachers"], (data) => {
          console.log("teachers data");
          console.log(data);
          return data?.map((el) => {
            if (el._id !== id) return el;
            else return { ...el, status: "offline" };
          });
        });
      }
      if (role === "student") {
        querClient.setQueriesData({ queryKey: ["myStudents"] }, (data) => {
          const updatedData = data?.map((el) => {
            if (el._id !== id) return el;
            else return { ...el, status: "offline" };
          });
          return updatedData;
        });
      }
      querClient.setQueriesData({ queryKey: ["gurfahData"] }, (data) => {
        console.log("runnning");
        if (data?.user?._id === id) console.log("runnning inside");
        return { user: { ...data?.user, status: "offline" } };
      });
    });

    socket.on("end-call", async () => {
      if (user?.role === "student") setVideoCallSeconds(0);
      // if(localVideoRef?.current)localVideoRef.current
      setIsCalling(false);
      setIsIncoming(false);
      setShowCallControls(false);
      setIsInCall(false);
      candidates.current = [];
      if (user?.role !== "student" && recorderRef.current) {
        recorderRef.current.stop();
        if (pathname.includes("onlineclass")) {
          const lastIndex = pathname.lastIndexOf("/");
          const refactoredPathname = pathname.slice(0, lastIndex);
          router.replace(`${refactoredPathname}/${targetUserRef.current}`, {
            scroll: false,
          });
        } else {
          const firstIndex = pathname.indexOf("/");
          const refactoredPathname = pathname.slice(0, firstIndex);
          router.replace(
            `${refactoredPathname}/onlineclass/${targetUserRef.current}`,
            { scroll: false },
          );
        }
      } else {
        // window.location.reload();
      }
      localMedia.current.getTracks().forEach((track) => track.stop());
      await turn();
    });
  }, [socket]);

  return (
    <Context.Provider
      value={{ startCall, acceptCall, dummyStartCall, dummyAnsCall, endCall }}
    >
      {children}
    </Context.Provider>
  );
}

export function useCallingFn() {
  return useContext(Context);
}
