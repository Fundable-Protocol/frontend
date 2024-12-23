"use client";

import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { ReactNode, useEffect, useRef } from "react";

const Dialog = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const showDialogParams = searchParams.get("showDialog");
  const showDialog = showDialogParams === "true";

  const closeDialog = () => {
    router.replace(window.location.pathname);
  };

  useEffect(() => {
    const dialog = dialogRef.current;

    if (showDialog) {
      dialog?.showModal();
      document.body.style.overflow = "hidden";

      dialog?.addEventListener("close", closeDialog);
    } else {
      dialog?.close();
      document.body.style.overflow = "";
    }

    return () => {
      dialog?.removeEventListener("close", closeDialog);
      document.body.style.overflow = "";
    };
  }, [showDialog]);

  return (
    <dialog ref={dialogRef} className="relative backdrop:transparent w-full">
      <div className="inset-0 h-full w-full fixed bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#5b21b6] via-[#0d0019] to-[#0d0019]" />

      <div className="relative mx-auto max-w-sm">
        <div className="flex justify-between items-center">
          <div className="flex gap-x-2">
            <span className="text-white text-xl font-medium">
              Connect Wallet
            </span>
          </div>
          <Image
            src="/svgs/close.svg"
            alt="close-modal"
            width={32}
            height={32}
            className="bg-white p-1 rounded-full h-auto w-auto cursor-pointer"
            onClick={closeDialog}
          />
        </div>

        <div className="mt-4">{children}</div>
      </div>
    </dialog>
  );
};

export default Dialog;
