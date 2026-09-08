"use client";

import { Toaster } from "sonner";

export function AdminToastProvider() {
  return (
    <Toaster
      theme="dark"
      position="top-right"
      toastOptions={{
        style: {
          background: "#171b26",
          border: "1px solid #2a3142",
          color: "#e8eaf0",
        },
      }}
    />
  );
}
