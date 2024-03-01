"use client";
import { Toaster } from "react-hot-toast";

import React from "react";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "17px",
          },
        }}
      />
      {children}
    </>
  );
};

export default Providers;