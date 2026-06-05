'use client'
import Modal from "../Modal";
import Select from 'react-select';
import { useAppProvider } from "../providers/AppProvider";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "../providers/UserProvider";
function MaqaraatForm() {
const {user} = useUser();
  const [isForm,setIsForm] = useState(false);

  if(!user?.role || user?.role !== 'admin') return null;
    if(user?.role === 'admin')return (
      <div className="flex justify-end">
        <button onClick={()=>setIsForm(true)} className="bg-(image:--gradient-primary) text-white p-3 rounded-md shadow-(--shadow-lg) text-xs">
          + Create Maqarat Session
        </button>
        {isForm && <Form onClose={() => setIsForm(false)}/>}
      </div>
    );
}

export default MaqaraatForm

const maqaratJuz = [
  { label: "juz 30 (1st nisf)", value: "juz 30 (1st nisf)" },
  { label: "juz 30 (2st nisf)", value: "juz 30 (2st nisf)" },
  { label: "juz 29 (1st nisf)", value: "juz 29 (1st nisf)" },
  { label: "juz 29 (2st nisf)", value: "juz 29 (2st nisf)" },
  { label: "juz 28 (1st nisf)", value: "juz 28 (1st nisf)" },
  { label: "juz 28 (2st nisf)", value: "juz 28 (2st nisf)" },
  { label: "juz 27 (1st nisf)", value: "juz 27 (1st nisf)" },
  { label: "juz 27 (2st nisf)", value: "juz 27 (2st nisf)" },
  { label: "juz 26 (1st nisf)", value: "juz 26 (1st nisf)" },
  { label: "juz 26 (2st nisf)", value: "juz 26 (2st nisf)" },
  { label: "juz 1", value: "juz 1" },
  { label: "juz 2", value: "juz 2" },
  { label: "juz 3", value: "juz 3" },
  { label: "juz 4", value: "juz 4" },
  { label: "juz 5", value: "juz 5" },
  { label: "juz 6", value: "juz 6" },
  { label: "juz 7", value: "juz 7" },
  { label: "juz 8", value: "juz 8" },
  { label: "juz 9", value: "juz 9" },
  { label: "juz 10", value: "juz 10" },
  { label: "juz 11", value: "juz 11" },
  { label: "juz 12", value: "juz 12" },
  { label: "juz 13", value: "juz 13" },
  { label: "juz 14", value: "juz 14" },
  { label: "juz 15", value: "juz 15" },
  { label: "juz 16", value: "juz 16" },
  { label: "juz 17", value: "juz 17" },
  { label: "juz 18", value: "juz 18" },
  { label: "juz 19", value: "juz 19" },
  { label: "juz 20", value: "juz 20" },
  { label: "juz 21", value: "juz 21" },
  { label: "juz 22", value: "juz 22" },
  { label: "juz 23", value: "juz 23" },
  { label: "juz 24", value: "juz 24" },
  { label: "juz 25", value: "juz 25" },
];

function Form({onClose}){
  const {teachers,students:allStudents} = useAppProvider();
  const queryClient = useQueryClient();

  const [teacher,setTeacher] = useState('');
  const [students,setStudents] = useState([]);
  const [juz,setJuz] = useState('');
  const [date,setDate] = useState('');
  const [batch,setBatch] = useState('');
  const teacherOptions = teachers?.map(el => {
    return { label: el.name, value: el._id };
  })
  const studentOptions = allStudents?.map(el => {
    return { label: el.name, value: el._id };
  })

  async function handleSubmit(e){
    e.preventDefault();
    const today = new Date();
    // if(new Date(date).getDate() < today.getDate()) return toast.error('you cannot set past dates');
    try{
      const res = await axios.post(`${process.env.NEXT_PUBLIC_URL}/maqarat/create`,{
        teacher,students,juz,date,batch
      },{withCredentials:true});
      if(res.data.ok) {
        toast.success('session created');
        queryClient.invalidateQueries(['maqarat'])
        onClose();
      }
    }catch(err){
      console.log(err);
      toast.error('failed to create session');
  }
  }
    return (
      <Modal onClose={onClose} className="h-fit w-[95%] lg:min-w-[40%] overflow-y-auto">
        <div className="">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Create Maqaarat
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Student */}
            <div>
              <label className="block text-sm font-medium mb-2">Teacher</label>
              <Select required isClearable options={teacherOptions} onChange={el => setTeacher(el.value)}/>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Batch</label>
              <Select required isClearable onChange={el => setBatch(el.value)} options={[{label:'Baneen',value:'baneen'},{label:'Banaat',value:'banaat'}]}/>
            </div>

            {/* Juz */}
            <div>
              <label className="block text-sm font-medium mb-2">Students</label>
              <Select required options={studentOptions} onChange={val => setStudents(el => val.map(el => el.value))} isMulti/>
            </div>

            {/* Surah */}
            <div>
              <label className="block text-sm font-medium mb-2">Juz</label>
              <Select required options={maqaratJuz} onChange={el => setJuz(el.value)}/>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <input value={date} onChange={el => setDate(el.target.value)} type="date" className="border border-gray-300 bg-white/90  w-full py-2 px-2"/>
            </div>

            <div className="flex gap-3 pt-3">
              <button onClick={()=>onClose()} type="button" className="flex-1 border border-(--border) shadow rounded-xl py-2">
                Cancel
              </button>

              <button
                type="submit"
                className="flex-1 bg-(image:--gradient-primary) text-white/90 text-sm rounded-xl py-2"
              >
                Create Session
              </button>
            </div>
          </form>
        </div>
      </Modal>
    );
}
