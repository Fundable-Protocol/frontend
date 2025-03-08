// components/ClientAutoConnect.tsx
"use client";

import dynamic from "next/dynamic";

// Dynamically import AutoConnect with ssr disabled
const AutoConnect = dynamic(() => import("@/components/ui/AutoConnect"), {
  ssr: false,
});

export default function ClientAutoConnect() {
  return <AutoConnect />;
}
