import { auth } from "@/auth"
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import UserProvider from "../providers/UserProvider";

async function ProtectRoutes({children}) {
    const session = await auth();
    if(!session?.user) return redirect('/auth');
    return <UserProvider>
        {children}
    </UserProvider>
}

export default ProtectRoutes
