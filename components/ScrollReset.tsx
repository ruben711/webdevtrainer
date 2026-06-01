"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** The scroll container is `.main`, not the window, so Next's default
   scroll-to-top on navigation doesn't reach it. Reset it on path change. */
export function ScrollReset() {
  const pathname = usePathname();
  useEffect(() => {
    document.querySelector(".main")?.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}
