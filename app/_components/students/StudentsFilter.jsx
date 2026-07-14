import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { IoFilterOutline } from "react-icons/io5"
import { useUser } from "../providers/UserProvider";

function StudentsFilter({ handleFilterStudents,readOnly=false }) {
  const {user} = useUser();
      const router = useRouter();
      const searchParams = useSearchParams();
      const pathname = usePathname();
      useEffect(() => {
        if(user?.role !== 'admin') return;
          const params = new URLSearchParams(searchParams);
          if(params.get('batch')) return;
          params.set('batch','yaqoot_mardo');
          router.replace(`${pathname}?${params}`);
      },[user?.role])
      function handleChangeSearchParams(type,value){
          const params = new URLSearchParams(searchParams);
          params.set(type, value);
          router.replace(`${pathname}?${params}`);
      }
  return (
    <div className="w-full pb-5 lg:w-1/2 lg:mx-auto flex flex-col items-center  gap-5">
      <div className="w-full h-full relative">
        <input
        readOnly={readOnly}
          onChange={(e) => handleFilterStudents(e.target.value)}
          type="text"
          placeholder="search students..."
          className="bg-(--card) placeholder:text-sm text-sm shadow focus:outline-none px-10 rounded-full py-3 w-full border border-(--border)"
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <CiSearch className="" />
        </div>
      </div>
      {user?.role === 'admin' && <div className="text-xs px-3 mt-3 justify-center flex-wrap flex gap-3">
        <button
        onClick={()=>handleChangeSearchParams('batch','yaqoot_mardo')}
          className={`${searchParams.get('batch') === 'yaqoot_mardo' ? 'bg-(image:--gradient-primary) text-white -translate-y-1 borde border-(--border)':'bg-(--card) border-transparent'} border-  hover:bg-(--card-highlight) hover:cursor-pointer ease-in-out duration-300 transition-all border-(--border) shadow-(--shadow-md)  p-2 rounded-md `}
        >
          Yaqoot (mardo)
        </button>
        <button
        onClick={()=>handleChangeSearchParams('batch','yaqoot_bairo')}
          className={`${searchParams.get('batch') === 'yaqoot_bairo' ? 'bg-(image:--gradient-primary) text-white -translate-y-1 borde border-(--border)':'bg-(--card) border-transparent'} border- hover:bg-(--card-highlight) hover:cursor-pointer ease-in-out duration-300 transition-all  shadow-(--shadow-md)  p-2 rounded-md `}
        >
          Yaqoot (bairo)
        </button>
        <button
        onClick={()=>handleChangeSearchParams('batch','baneen')}
          className={`${searchParams.get('batch') === 'baneen' ? 'bg-(image:--gradient-primary) text-white -translate-y-1 borde border-(--border)':'bg-(--card) border-transparent'} border- hover:bg-(--card-highlight) hover:cursor-pointer ease-in-out duration-300 transition-all border-(--border) shadow-(--shadow-md)  p-2 rounded-md `}
        >
          Baneen
        </button>
        <button
        onClick={()=>handleChangeSearchParams('batch','banaat')}
          className={`${searchParams.get('batch') === 'banaat' ? 'bg-(image:--gradient-primary) text-white -translate-y-1 borde border-(--border)':'bg-(--card) border-transparent'} border- hover:bg-(--card-highlight) hover:cursor-pointer ease-in-out duration-300 transition-all border-(--border) shadow-(--shadow-md)  p-2 rounded-md `}
        >
          Banaat
        </button>
        <button
        onClick={()=>handleChangeSearchParams('batch','kibaar')}
          className={`${searchParams.get('batch') === 'kibaar' ? 'bg-(image:--gradient-primary) text-white -translate-y-1 borde border-(--border)':'bg-(--card) border-transparent'} border- hover:bg-(--card-highlight) hover:cursor-pointer ease-in-out duration-300 transition-all  border-(--border) shadow-(--shadow-md)  p-2 rounded-md `}
        >
          Kibar
        </button>
        <button
        onClick={()=>handleChangeSearchParams('batch','taheri_hall')}
          className={`${searchParams.get('batch') === 'taheri_hall' ? 'bg-(image:--gradient-primary) text-white -translate-y-1 borde border-(--border)':'bg-(--card) border-transparent'} border- hover:bg-(--card-highlight) hover:cursor-pointer ease-in-out duration-300 transition-all  border-(--border) shadow-(--shadow-md)  p-2 rounded-md `}
        >
          Taheri hall
        </button>
      </div>}
      {/* <button className="bg-(--card) p-3 px-4 shadow rounded-full">
        <IoFilterOutline />
      </button> */}
    </div>
  );
}

export default StudentsFilter;
