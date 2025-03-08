// hooks/useIsMounted.ts
"use client";
import { useState, useEffect } from "react";

export function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false);
  const [hasPrevWallet, setHasPrevWallet] = useState<boolean>(
    typeof window !== "undefined" &&
      !!localStorage.getItem("starknetConnectorId")
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return { isMounted, hasPrevWallet, setHasPrevWallet };
}
