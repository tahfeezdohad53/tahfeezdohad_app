import { useUser } from "@/app/_components/providers/UserProvider";
import useFilter from "@/shared/hooks/useFilter";
import { useEffect } from "react";

function useSetAttendanceSearchParams() {
    const { searchParams, pathname, router } = useFilter();
    const {user} = useUser();
    
    useEffect(() => {
      const url = new URLSearchParams(searchParams);
      if (!searchParams.get("page")) url.set("page", "1");
      if (!searchParams.get("batch") && user?.role === "admin")
        url.set("batch", "all");
      router.replace(`${pathname}?${url}`, { scroll: false });
    }, []);
}

export default useSetAttendanceSearchParams
