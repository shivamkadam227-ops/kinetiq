"use client";
import { useState, useEffect } from "react";
import { User, Palette, Bell, Bot, Shield, Save, ChevronDown, ChevronUp, Download, Trash2, Check } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Card from "@/components/ui/Card";
import { getSettings, updateSettings } from "@/lib/dataStore";

const accentColors = [
  { name: "Purple", value: "purple", color: "#8b5cf6" },
  { name: "Blue", value: "blue", color: "#3b82f6" },
  { name: "Green", value: "green", color: "#22c55e" },
  { name: "Orange", value: "orange", color: "#f97316" },
  { name: "Pink", value: "pink", color: "#ec4899" },
  { name: "Cyan", value: "cyan", color: "#06b6d4" },
];

const fontSizes = [
  { label: "Small", value: "small" },
  { label: "Medium", value: "medium" },
  { label: "Large", value: "large" },
];

export default function SettingsPage() {
  const { user } = useUser();
  const [settings, setSettings] = useState(null);
  const [expanded, setExpanded] = useState("Profile");
  const [saved, setSaved] = useState("");

  useEffect(() => {
    const s = getSettings();
    // Pre-fill name from Clerk if empty
    if (!s.profile.name && user) {
      s.profile.name = user.fullName || "";
    }
    setSettings(s);
  }, [user]);

  if (!settings) return null;

  const handleUpdate = (section, key, value) => {
    const updated = { ...settings };
    updated[section] = { ...updated[section], [key]: value };
    setSettings(updated);
    updateSettings(section, { [key]: value });
    setSaved(section + "-" + key);
    setTimeout(() => setSaved(""), 2000);
  };

  const handleExportData = () => {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("kq_")) {
        data[key] = JSON.parse(localStorage.getItem(key));
      }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "kinetiq-data-export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all data? This cannot be undone.")) {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith("kq_")) keys.push(key);
      }
      keys.forEach((k) => localStorage.removeItem(k));
      window.location.reload();
    }
  };

  const toggle = (title) => setExpanded(expanded === title ? null : title);

  const SavedIndicator = ({ id }) => (
    saved === id ? <span className="text-xs text-green-400 flex items-center gap-1"><Check size={12} /> Saved</span> : null
  );

  const sections = [
    {
      icon: User, title: "Profile", desc: "Manage your personal details",
      content: (
        <div className="space-y-4 pt-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Full Name</label>
            <input
              type="text"
              value={settings.profile.name}
              onChange={(e) => handleUpdate("profile", "name", e.target.value)}
              className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/30 transition-all"
              placeholder="Your full name"
            />
            <SavedIndicator id="profile-name" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Email</label>
            <input
              type="email"
              value={user?.primaryEmailAddress?.emailAddress || ""}
              disabled
              className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/[0.04] rounded-xl text-sm text-slate-500 cursor-not-allowed"
            />
            <p className="text-[10px] text-slate-600 mt-1">Managed by your account provider</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Grade / Class</label>
              <input
                type="text"
                value={settings.profile.grade}
                onChange={(e) => handleUpdate("profile", "grade", e.target.value)}
                className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/30 transition-all"
                placeholder="e.g. 12th Grade"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">School / Institution</label>
              <input
                type="text"
                value={settings.profile.school}
                onChange={(e) => handleUpdate("profile", "school", e.target.value)}
                className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/30 transition-all"
                placeholder="Your school name"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Bio</label>
            <textarea
              value={settings.profile.bio}
              onChange={(e) => handleUpdate("profile", "bio", e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/30 transition-all resize-none"
              placeholder="Tell us a bit about yourself..."
            />
          </div>
        </div>
      ),
    },
    {
      icon: Palette, title: "Appearance", desc: "Customize theme and display",
      content: (
        <div className="space-y-5 pt-4">
          <div>
            <label className="block text-xs text-slate-400 mb-3">Theme</label>
            <div className="flex gap-3">
              {["dark", "light"].map((theme) => (
                <button
                  key={theme}
                  onClick={() => handleUpdate("appearance", "theme", theme)}
                  className={[
                    "flex-1 py-3 rounded-xl text-sm font-medium transition-all border text-center capitalize",
                    settings.appearance.theme === theme
                      ? "bg-purple-500/20 border-purple-500/30 text-purple-300"
                      : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10",
                  ].join(" ")}
                >
                  {theme === "dark" ? "🌙 " : "☀️ "}{theme} Mode
                </button>
              ))}
            </div>
            {settings.appearance.theme === "light" && (
              <p className="text-[10px] text-amber-400/80 mt-2">⚠ Light mode support is limited. Dark mode is recommended.</p>
            )}
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-3">Accent Color</label>
            <div className="flex gap-3 flex-wrap">
              {accentColors.map((c) => (
                <button
                  key={c.value}
                  onClick={() => handleUpdate("appearance", "accentColor", c.value)}
                  className={[
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all border",
                    settings.appearance.accentColor === c.value
                      ? "border-white/20 bg-white/10 text-white"
                      : "border-white/[0.06] bg-white/[0.02] text-slate-400 hover:bg-white/5",
                  ].join(" ")}
                >
                  <span className="w-4 h-4 rounded-full" style={{ backgroundColor: c.color }} />
                  {c.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-3">Font Size</label>
            <div className="flex gap-3">
              {fontSizes.map((f) => (
                <button
                  key={f.value}
                  onClick={() => handleUpdate("appearance", "fontSize", f.value)}
                  className={[
                    "flex-1 py-2.5 rounded-xl text-sm font-medium transition-all border text-center",
                    settings.appearance.fontSize === f.value
                      ? "bg-purple-500/20 border-purple-500/30 text-purple-300"
                      : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10",
                  ].join(" ")}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: Bell, title: "Notifications", desc: "Configure notification preferences",
      content: (
        <div className="space-y-4 pt-4">
          {[
            { key: "inApp", label: "In-App Notifications", desc: "Show notifications for completed tests, bookmarks, etc." },
            { key: "streakReminders", label: "Streak Reminders", desc: "Get reminded to maintain your learning streak" },
            { key: "testReminders", label: "Test Reminders", desc: "Reminders for scheduled tests and practice" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl">
              <div>
                <p className="text-sm text-white font-medium">{item.label}</p>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
              <button
                onClick={() => handleUpdate("notifications", item.key, !settings.notifications[item.key])}
                className={"w-11 h-6 rounded-full transition-all " + (settings.notifications[item.key] ? "bg-purple-500" : "bg-white/20")}
              >
                <div className={"w-5 h-5 rounded-full bg-white shadow transition-transform " + (settings.notifications[item.key] ? "translate-x-5.5" : "translate-x-0.5")} />
              </button>
            </div>
          ))}
        </div>
      ),
    },
    {
      icon: Bot, title: "AI Tutor", desc: "Customize AI behavior and responses",
      content: (
        <div className="space-y-5 pt-4">
          <div>
            <label className="block text-xs text-slate-400 mb-3">Response Style</label>
            <div className="flex gap-3">
              {["concise", "detailed"].map((style) => (
                <button
                  key={style}
                  onClick={() => handleUpdate("aiTutor", "responseStyle", style)}
                  className={[
                    "flex-1 py-3 rounded-xl text-sm font-medium transition-all border text-center capitalize",
                    settings.aiTutor.responseStyle === style
                      ? "bg-purple-500/20 border-purple-500/30 text-purple-300"
                      : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10",
                  ].join(" ")}
                >
                  {style === "concise" ? "⚡ " : "📖 "}{style}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-3">Default Difficulty</label>
            <div className="flex gap-3">
              {["easy", "medium", "hard"].map((level) => (
                <button
                  key={level}
                  onClick={() => handleUpdate("aiTutor", "difficultyLevel", level)}
                  className={[
                    "flex-1 py-2.5 rounded-xl text-sm font-medium transition-all border text-center capitalize",
                    settings.aiTutor.difficultyLevel === level
                      ? "bg-purple-500/20 border-purple-500/30 text-purple-300"
                      : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10",
                  ].join(" ")}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: Shield, title: "Account", desc: "Security and data management",
      content: (
        <div className="space-y-4 pt-4">
          <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl">
            <p className="text-sm text-white font-medium mb-1">Account Security</p>
            <p className="text-xs text-slate-500 mb-3">Your account is managed through Clerk. Click below to manage your security settings.</p>
            <button
              onClick={() => { if (user) user.openUserProfile?.(); }}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white hover:bg-white/10 transition-all"
            >
              Manage Account
            </button>
          </div>
          <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl">
            <p className="text-sm text-white font-medium mb-1">Export Data</p>
            <p className="text-xs text-slate-500 mb-3">Download all your learning data as a JSON file.</p>
            <button
              onClick={handleExportData}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white hover:bg-white/10 transition-all"
            >
              <Download size={14} /> Export Data
            </button>
          </div>
          <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl">
            <p className="text-sm text-red-400 font-medium mb-1">Danger Zone</p>
            <p className="text-xs text-slate-500 mb-3">Clear all local learning data. This action cannot be undone.</p>
            <button
              onClick={handleClearData}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400 hover:bg-red-500/20 transition-all"
            >
              <Trash2 size={14} /> Clear All Data
            </button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
        <p className="text-sm text-slate-400">Manage your preferences</p>
      </div>
      <div className="space-y-3">
        {sections.map((s) => (
          <Card key={s.title} className="overflow-hidden" hover={false}>
            <button
              onClick={() => toggle(s.title)}
              className="w-full flex items-center gap-4 p-5"
            >
              <div className="p-2.5 rounded-xl bg-white/5">
                <s.icon size={20} className="text-purple-400" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-sm font-semibold text-white">{s.title}</h3>
                <p className="text-xs text-slate-500">{s.desc}</p>
              </div>
              {expanded === s.title ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
            </button>
            {expanded === s.title && (
              <div className="px-5 pb-5 border-t border-white/[0.06]">
                {s.content}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}