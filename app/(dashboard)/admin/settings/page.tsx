// *********************************************************************
// Role of the page: Admin Settings — Appearance (theme selection)
// Route: /admin/settings  (linked from DashboardSidebar)
// Developer: skaftorAI · WO-01
// *********************************************************************
"use client";

import { DashboardSidebar, ThemeSwitcher } from "@/components";
import React from "react";

const SettingsPage = () => {
  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto h-full max-xl:flex-col max-xl:h-fit max-xl:gap-y-4">
      <DashboardSidebar />
      <div className="flex flex-col gap-y-6 w-full xl:ml-5 max-xl:px-2 py-6">
        <h1 className="text-3xl font-bold text-brand-on-surface">Settings</h1>
        <ThemeSwitcher />
      </div>
    </div>
  );
};

export default SettingsPage;
