// hooks/useIsMounted.ts
"use client";
import { useState, useEffect } from "react";

export function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false);
  const [hasPrevWallet, setHasPrevWallet] = useState(true);
  useEffect(() => {
    setIsMounted(true);

    const isPreviousConnected = localStorage.getItem("starknetConnectorId");

    if (!isPreviousConnected) setHasPrevWallet(false);
  }, []);
  return { isMounted, hasPrevWallet };
}
