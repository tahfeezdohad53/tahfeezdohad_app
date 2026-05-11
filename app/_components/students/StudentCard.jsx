import Image from "next/image";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";

function StudentCard({image,name,studentId}) {
    return (
      <div className="flex justify-center">
        <Link
          href={`/entry/${studentId}`}
          className="border-t-4 border-amber-900 flex flex-col items-center bg-(--layer) w-3/4 p-5 rounded-md shadow border border-x-(--border) border-b-(--border) gap-3"
        >
          {image && <div className="relative h-18 w-18 rounded-full overflow-hidden">
                  <Image src={image} alt="user photo" fill/>
                </div>}
          {!image && <FaUserCircle className="text-5xl text-amber-950" />}
          <p className="font-semibold text-stone-800 tracking-wider">
            {name}
          </p>
        </Link>
      </div>
    );
}

export default StudentCard
