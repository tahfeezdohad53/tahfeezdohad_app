// app/auth/page.jsx
import { Cinzel } from "next/font/google";
import GoogleButton from "../_components/auth/GoogleButton";
import AuthForm from "../_components/auth/AuthForm";
const font = Cinzel({
    subsets:['latin'],
    weight:['500','600','700']
})
export default function Page() {
  return (
    <div className="fixed w-full flex h-full items-center justify-center px-4 bg-[url('/auth.png')] bg-cover" >
      <div className=" backdrop-blur-sm w-full max-w-md rounded-3xl border-1 border-white p-8 pt-2 shadow-(--shadow-lg)">
        {/* <div className="mb-8 text-center">
          <h1 className={` ${font.className} text-3xl font-bold tracking-tight text-[#2b1d14]`}>
            Tahfeez Dohad
          </h1>

          <p className="mt-2 text-sm text-[#6b4d36]">
            Sign in to continue
          </p>
        </div> */} 
        <img src="/Dohad.png" className="w-1/2 mx-auto" alt="" />
          <AuthForm />
      </div>
    </div>
  );
}
