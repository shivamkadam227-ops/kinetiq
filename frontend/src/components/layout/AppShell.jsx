"use client";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { updateStreak } from "@/lib/dataStore";

export default function AppShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Update streak on app load
  useEffect(() => {
    updateStreak();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#06060e]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col lg:ml-[260px]">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}