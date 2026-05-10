import AuthForm from "../_components/auth/AuthForm";
import GoogleButton from "../_components/auth/GoogleButton";

export default function Page() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="border border-(--highlightBorder) w-full max-w-md rounded-2xl bg-(--layer) p-8 shadow-lg">
        <h1 className="text-xl font-bold text-center mb-5">signin to continue with Tahfeez Dohad</h1>
        <GoogleButton />
      </div>
    </div>
  );
}
