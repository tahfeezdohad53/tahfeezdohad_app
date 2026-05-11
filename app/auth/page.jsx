// app/auth/page.jsx
import GoogleButton from "../_components/auth/GoogleButton";

export default function Page() {
  return (
    <div className="flex h-full items-center justify-center bg-[#f0d8a1] px-4">
      <div className="w-full max-w-md rounded-3xl border border-[#d2b57c] bg-[#f7e6bf] p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[#2b1d14]">
            Welcome to Tahfeez Dohad
          </h1>

          <p className="mt-2 text-sm text-[#6b4d36]">
            Continue with Google as Student, Teacher, or Admin
          </p>
        </div>

        <div className="space-y-4">
          <GoogleButton role="student" />
          <GoogleButton role="teacher" />
          <GoogleButton role="admin" />
        </div>
      </div>
    </div>
  );
}
