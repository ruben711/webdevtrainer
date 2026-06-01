import { useEffect, useState } from "react";

/**
 * Returns false on the server / first client render, true after mount.
 * Gate anything that reads persisted (zustand-persist / localStorage) state
 * behind this to avoid React hydration mismatches.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
