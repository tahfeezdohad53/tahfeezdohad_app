import LogoutButton from "../_components/auth/LogoutButton";
import ProtectRoutes from "../_components/auth/ProtectRoutes";
import UploadImage from "../_components/profile/UploadImage";
import UpdatePassword from "../_components/profile/UpdatePassword";
import InfoFields from "../_components/profile/InfoFields";
import Broadcast from "../_components/profile/Broadcast";

async function Page() {

  return (
      <div className="h-full bg-(--background) flex items-center justify-center p-5">
        <div className="w-full max-w-md bg-(--layer) rounded-4xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-black/5">
          <div>
            <h1 className="text-3xl font-bold text-[#5c4320] mb-8 text-center">
              Profile
            </h1>

            <div className="flex flex-col gap-5">
              {/* Profile Image */}
              <UploadImage />

              {/* Email */}
             <InfoFields />
              <UpdatePassword />
              <Broadcast />
            </div>
          </div>
          <div className="mt-4 w-full">
            <LogoutButton />
          </div>
        </div>
      </div>
  );
}

export default Page;
