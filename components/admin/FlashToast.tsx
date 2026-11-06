"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "./ToastProvider";

/** Shows a one-off toast after a redirect (e.g. ?created=1) and cleans the URL. */
export function FlashToast({ message }: { message: string | null }) {
  const { push } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const shown = useRef(false);

  useEffect(() => {
    if (!message || shown.current) return;
    shown.current = true;
    push("success", message);
    router.replace(pathname, { scroll: false });
  }, [message, push, router, pathname]);

  return null;
}
