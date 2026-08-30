'use client'

import { usePathname, useRouter, useSearchParams } from "next/navigation";

function useFilter() {
    const searchParams = useSearchParams();
        const router = useRouter();
        const pathname = usePathname();
        
        function handleChangeSearchParams(type, value) {
          const params = new URLSearchParams(searchParams);
          params.set(type, value);
          router.replace(`${pathname}?${params}`);
        }

        return {handleChangeSearchParams,searchParams,router,pathname};
}

export default useFilter
