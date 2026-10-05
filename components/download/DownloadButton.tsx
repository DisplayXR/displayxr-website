"use client";

import { Button } from "@/components/ui/Button";
import { useVisitorOS } from "@/lib/visitor-os";
import { DOWNLOAD_HREF } from "@/lib/constants";

/**
 * The primary "Get DisplayXR" action. It names the visitor's OS once known,
 * and always lands on /download, which carries the honest per-OS states
 * (the order of the two installs, macOS coming soon, nothing for iOS).
 */
export function DownloadButton({ variant = "primary" }: { variant?: "primary" | "secondary" }) {
  const os = useVisitorOS();
  const label =
    os && os !== "iOS" ? `Get DisplayXR for ${os}` : "Get DisplayXR";
  return (
    <Button variant={variant} href={DOWNLOAD_HREF}>
      {label}
    </Button>
  );
}
