'use client';

import { usePathname } from "next/navigation";

function SidebarPlaceholder() {
    const pathname = usePathname();
    if(pathname.includes('auth')) return null;
    return <div className="min-w-40 hidden lg:block border"></div>;
}

export default SidebarPlaceholder
