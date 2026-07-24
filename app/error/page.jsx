import Link from "next/link";

function Page() {
    return (
      <div className="h-screen flex flex-col gap-4 items-center justify-center">
        <div className="text-center font-bold fixed top-1/2 left-1/2 -translate-1/2">
          <h1>oops! something went wrong while signing in</h1>
          <h1>please try again</h1>
        <Link href="/auth" className="bg-amber-900 text-white px-5 py-1 rounded-sm mt-4">back</Link>
        </div>
      </div>
    );
}

export default Page
