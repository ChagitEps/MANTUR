import { useEffect, type RefObject } from "react";

/** קורא ל-onOutside כשלוחצים מחוץ לאלמנט (לסגירת פופאובר/דרופדאון). */
export function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  onOutside: () => void,
) {
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, onOutside]);
}
