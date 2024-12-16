"use client";

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
    <dialog ref={dialogRef} className="relative backdrop:transparent">
      <div className="inset-0 h-full w-full fixed bg-[url('/imgs/modal-bg.jpg')] bg-cover" />
      {/* <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-70" /> */}

      <div className="relative z-10">
        <button
          onClick={closeDialog}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <div className="mt-4">{children}</div>
      </div>
    </dialog>
  );
};

export default Dialog;
