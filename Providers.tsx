"use client";
import { Toaster } from "react-hot-toast";

import React from "react";
import ThemeProvider from "@/app/theme/ThemeProvider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "17px",
          },
        }}
      />
      {children}
    </ThemeProvider>
  );
};

export default Providers;