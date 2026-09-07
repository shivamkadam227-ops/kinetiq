"use client";
import { useState, useEffect, useRef } from "react";
import { Bell, Check, Trash2, Atom, ClipboardCheck, Flame, Bookmark, X } from "lucide-react";
import { getNotifications, markNotificationRead, markAllNotificationsRead, clearNotifications, getUnreadCount } from "@/lib/dataStore";

const typeIcons = { test: ClipboardCheck, simulation: Atom, streak: Flame, bookmark: Bookmark };
const typeColors = { test: "text-green-400", simulation: "text-purple-400", streak: "text-orange-400", bookmark: "text-cyan-400" };

export default function NotificationPanel({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const panelRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setNotifications(getNotifications());
    }
  }, [isOpen]);

  // Close on click outside
  useEffect(() => {
    const handleClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [isOpen, onClose]);

  const handleMarkRead = (id) => {
    const updated = markNotificationRead(id);
    setNotifications(updated);
  };

  const handleMarkAllRead = () => {
    const updated = markAllNotificationsRead();
    setNotifications(updated);
  };

  const handleClear = () => {
    clearNotifications();
    setNotifications([]);
  };

  const formatTime = (timestamp) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return mins + "m ago";
    const hours = Math.floor(mins / 60);
    if (hours < 24) return hours + "h ago";
    const days = Math.floor(hours / 24);
    return days + "d ago";
  };

  if (!isOpen) return null;

  return (
    <div ref={panelRef} className="absolute top-full right-0 mt-2 w-[360px] max-h-[480px] bg-[#0a0b1e]/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <h3 className="text-sm font-semibold text-white">Notifications</h3>
        <div className="flex items-center gap-2">
          {notifications.some((n) => !n.read) && (
            <button onClick={handleMarkAllRead} className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button onClick={handleClear} className="p-1 text-slate-500 hover:text-red-400 rounded transition-colors">
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="overflow-y-auto max-h-[400px]">
        {notifications.length === 0 ? (
          <div className="py-12 text-center">
            <Bell size={24} className="text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-500">No notifications yet</p>
            <p className="text-xs text-slate-600 mt-1">Activity will appear here</p>
          </div>
        ) : (
          notifications.map((n) => {
            const Icon = typeIcons[n.type] || Bell;
            const color = typeColors[n.type] || "text-slate-400";
            return (
              <div
                key={n.id}
                onClick={() => handleMarkRead(n.id)}
                className={[
                  "flex items-start gap-3 px-4 py-3 border-b border-white/[0.04] cursor-pointer transition-colors",
                  n.read ? "opacity-50" : "hover:bg-white/[0.02]",
                ].join(" ")}
              >
                <div className={["p-1.5 rounded-lg bg-white/5 mt-0.5", color].join(" ")}>
                  <Icon size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium">{n.title}</p>
                  <p className="text-xs text-slate-500 truncate">{n.desc}</p>
                  <p className="text-[10px] text-slate-600 mt-1">{formatTime(n.timestamp)}</p>
                </div>
                {!n.read && (
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
