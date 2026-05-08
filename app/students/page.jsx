import Image from "next/image";
import Link from "next/link"
import { FaUser, FaUserCircle } from "react-icons/fa"
import { FaArrowLeftLong } from "react-icons/fa6";

function Page() {
    return (
      <div className=" h-full">
        {/* <Link
          href="/recordings"
          className="absolute top-5 left-5 bg-amber-900 text-white px-4 py-1 rounded-md flex items-center gap-2 "
        >
          <FaArrowLeftLong /> recordings
        </Link> */}
        <div className="mt-10 flex items-center justify-center w-full ">
          <h1 className="w-fit bg-amber-800 px-10 py-2 rounded-tl-full rounded-br-full shadow border border-(--border) font-semibold text-xl text-white tracking-wide">
            Huzefa ratlam&apos;s diary
          </h1>
        </div>
        {/* <hr className="mt-5 text-amber-400"/> */}
        <div className="px-5 mt-10">
          <div className="grid grid-cols-2 gap-y-6">
            <div className="flex justify-center">
              <Link
                href="/entry"
                className="border-t-4 border-amber-900 flex flex-col items-center bg-(--layer) w-3/4 p-5 rounded-md shadow border border-x-(--border) border-b-(--border) gap-3"
              >
                {/* <div className="relative h-18 w-18 rounded-full overflow-hidden">
                  <Image src="/me.jpg" alt="user photo" fill/>
                </div> */}
                <FaUserCircle className="text-5xl text-amber-950"/>
                <p className="font-semibold text-stone-800 tracking-wider">Aziz naya</p>
              </Link>
            </div>
            <div className="flex justify-center">
              <Link
                href="/entry"
                className="border-t-4 border-amber-900 flex flex-col items-center bg-(--layer) w-3/4 p-5 rounded-md shadow border border-x-(--border) border-b-(--border) gap-3"
              >
                {/* <div className="relative h-18 w-18 rounded-full overflow-hidden">
                  <Image src="/me.jpg" alt="user photo" fill/>
                </div> */}
                <FaUserCircle className="text-5xl text-amber-950"/>
                <p className="font-semibold text-stone-800 tracking-wider">Aziz naya</p>
              </Link>
            </div>
            <div className="flex justify-center">
              <Link
                href="/entry"
                className="border-t-4 border-amber-900 flex flex-col items-center bg-(--layer) w-3/4 p-5 rounded-md shadow border border-x-(--border) border-b-(--border) gap-3"
              >
                {/* <div className="relative h-18 w-18 rounded-full overflow-hidden">
                  <Image src="/me.jpg" alt="user photo" fill/>
                </div> */}
                <FaUserCircle className="text-5xl text-amber-950"/>
                <p className="font-semibold text-stone-800 tracking-wider">Aziz naya</p>
              </Link>
            </div>
            <div className="flex justify-center">
              <Link
                href="/entry"
                className="border-t-4 border-amber-900 flex flex-col items-center bg-(--layer) w-3/4 p-5 rounded-md shadow border border-x-(--border) border-b-(--border) gap-3"
              >
                {/* <div className="relative h-18 w-18 rounded-full overflow-hidden">
                  <Image src="/me.jpg" alt="user photo" fill/>
                </div> */}
                <FaUserCircle className="text-5xl text-amber-950"/>
                <p className="font-semibold text-stone-800 tracking-wider">Aziz naya</p>
              </Link>
            </div>
            <div className="flex justify-center">
              <Link
                href="/entry"
                className="border-t-4 border-amber-900 flex flex-col items-center bg-(--layer) w-3/4 p-5 rounded-md shadow border border-x-(--border) border-b-(--border) gap-3"
              >
                {/* <div className="relative h-18 w-18 rounded-full overflow-hidden">
                  <Image src="/me.jpg" alt="user photo" fill/>
                </div> */}
                <FaUserCircle className="text-5xl text-amber-950"/>
                <p className="font-semibold text-stone-800 tracking-wider">Aziz naya</p>
              </Link>
            </div>
            <div className="flex justify-center">
              <Link
                href="/entry"
                className="border-t-4 border-amber-900 flex flex-col items-center bg-(--layer) w-3/4 p-5 rounded-md shadow border border-x-(--border) border-b-(--border) gap-3"
              >
                {/* <div className="relative h-18 w-18 rounded-full overflow-hidden">
                  <Image src="/me.jpg" alt="user photo" fill/>
                </div> */}
                <FaUserCircle className="text-5xl text-amber-950"/>
                <p className="font-semibold text-stone-800 tracking-wider">Aziz naya</p>
              </Link>
            </div>
            
            
            
          </div>
        </div>
      </div>
    );
}

export default Page
