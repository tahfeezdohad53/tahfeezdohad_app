'use server';

import { signIn, signOut } from "@/auth";
import { cookies } from "next/headers";

export async function handleSignIn(data){
    const cookieStore = await cookies();
    cookieStore.set('role',data.get('role'));
    await signIn('google');
}
export async function handleLogout(){
    // const cookieStore = await cookies();
    // cookieStore.delete('jwt',{
    //     sameSite:'none',
    //     httpOnly:true,
    //     secure:true,
    // });
    await signOut({redirectTo:'/auth'});
}