"use client";
import { useState } from "react";
import { User, Palette, Bell, Bot, Shield } from "lucide-react";
import Card from "@/components/ui/Card";

const sections = [
  { icon: User, title: "Profile", desc: "Manage your account details" },
  { icon: Palette, title: "Appearance", desc: "Customize theme and display" },
  { icon: Bell, title: "Notifications", desc: "Configure notification preferences" },
  { icon: Bot, title: "AI Tutor", desc: "Customize AI behavior and responses" },
  { icon: Shield, title: "Account", desc: "Security and privacy settings" },
];

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="p-4 sm:p-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
        <p className="text-sm text-slate-400">Manage your preferences</p>
      </div>
      <div className="space-y-4">
        {sections.map((s) => (
          <Card key={s.title} className="p-5" hover={false}>
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-white/5">
                <s.icon size={20} className="text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-white">{s.title}</h3>
                <p className="text-xs text-slate-500">{s.desc}</p>
              </div>
              {s.title === "Appearance" && (
                <button onClick={() => setDarkMode(!darkMode)}
                  className={"w-11 h-6 rounded-full transition-all " + (darkMode ? "bg-purple-500" : "bg-white/20")}>
                  <div className={"w-5 h-5 rounded-full bg-white shadow transition-transform " + (darkMode ? "translate-x-5.5" : "translate-x-0.5")} />
                </button>
              )}
              {s.title === "Notifications" && (
                <button onClick={() => setNotifications(!notifications)}
                  className={"w-11 h-6 rounded-full transition-all " + (notifications ? "bg-purple-500" : "bg-white/20")}>
                  <div className={"w-5 h-5 rounded-full bg-white shadow transition-transform " + (notifications ? "translate-x-5.5" : "translate-x-0.5")} />
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}