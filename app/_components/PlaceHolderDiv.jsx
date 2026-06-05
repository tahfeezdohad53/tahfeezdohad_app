'use client';

import { usePathname } from "next/navigation";

function PlaceHolderDiv() {
    const pathname = usePathname();
    if(pathname.includes('entry')) return null;
    return (
        <div className="h-20 lg:hidden">
            
        </div>
    )
}

export default PlaceHolderDiv
