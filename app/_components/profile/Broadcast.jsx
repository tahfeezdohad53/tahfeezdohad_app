'use client';

import { useState } from "react";
import { useSocketContext } from "../providers/SocketProvider";
import { useUser } from "../providers/UserProvider";

function Broadcast() {
    const {socket} = useSocketContext();
    const {user} = useUser();
    const [message,setMessage] = useState('');
    function handleSendBroadcastMessage(e){
        e.preventDefault();
        if(!message) return;
        const isConfirm = confirm('are you sure ?');
        if(isConfirm) socket.emit('broadcast',{message})
    }

    if(!user?._id) return;
    if(user.role !== 'admin') return;
  return (
    <form onSubmit={handleSendBroadcastMessage} className="flex flex-col gap-2">
      <label className="text-[#6f542d] text-sm">Broadcast Message</label>
      <textarea
      rows={5}
      onChange={(e)=>setMessage(e.target.value)}
      value={message}
        required
        type="text"
        placeholder="type message..."
        className="bg-white/70 border border-[#d8c08e] text-[#4d3718] rounded-xl px-4 py-3 outline-none focus:border-[#8b6a36] focus:bg-white transition placeholder:text-[#9a8259]"
      />
      <button className="w-full flex gap-2 items-center justify-center bg-[#5c4320] text-white py-3 rounded-xl font-semibold hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] transition shadow-md mt-2">
        send
      </button>
    </form>
  );
}

export default Broadcast;
