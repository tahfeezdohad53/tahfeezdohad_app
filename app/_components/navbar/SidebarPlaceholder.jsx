'use client';

import { usePathname } from "next/navigation";

function SidebarPlaceholder() {
    const pathname = usePathname();
    if(pathname.includes('auth')) return null;
    return <div className="min-w-45 hidden lg:block"></div>;
}

export default SidebarPlaceholder
