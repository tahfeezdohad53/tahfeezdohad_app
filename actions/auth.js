'use server';

import { signIn, signOut } from "@/auth";
import { cookies } from "next/headers";

export async function handleSignIn(data){
    const cookieStore = await cookies();
    cookieStore.set('role',data.get('role'));
    let redirectUrl;
    if(data.get('role') === 'student') redirectUrl = '/recordings';
    else redirectUrl = '/students';
    await signIn('google',{redirectTo:redirectUrl});
}
export async function handleLogout(){
    await signOut();
}