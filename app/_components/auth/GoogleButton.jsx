// _components/auth/GoogleButton.jsx
import { handleSignIn } from "@/actions/auth";
import { FcGoogle } from "react-icons/fc";

export default function GoogleButton({ role }) {
  return (
    <form action={handleSignIn}>
      <input type="hidden" name="role" value={role} />

      <button className="flex w-full items-center justify-center gap-3 rounded-2xl border border-[#4b3425] bg-[#2b1d14] px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:scale-[1.01] hover:bg-[#3a271b] active:scale-[0.98]">
        <div className="rounded-full bg-white p-1 shadow-sm">
          <FcGoogle className="text-xl" />
        </div>

        <span className="tracking-wide">
          Continue as <span className="capitalize text-[#f0d8a1]">{role}</span>
        </span>
      </button>
    </form>
  );
}
