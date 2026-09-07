"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Atom, MessageSquareText, ClipboardCheck, Trash2, ExternalLink, Bookmark } from "lucide-react";
import { getBookmarks, removeBookmark } from "@/lib/dataStore";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

const tabs = ["All", "Simulations", "Tests", "Tutor Chats"];
const typeFilters = { All: null, Simulations: "simulation", Tests: "test", "Tutor Chats": "tutor" };
const typeIcons = { simulation: Atom, test: ClipboardCheck, tutor: MessageSquareText };
const typeBadge = { simulation: "purple", test: "green", tutor: "cyan" };

export default function BookmarksPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [items, setItems] = useState([]);
  const router = useRouter();

  useEffect(() => {
    setItems(getBookmarks());
  }, []);

  const filtered = typeFilters[activeTab] ? items.filter((i) => i.type === typeFilters[activeTab]) : items;

  const handleDelete = (id) => {
    const updated = removeBookmark(id);
    setItems(updated);
  };

  const handleOpen = (item) => {
    if (item.type === "simulation" && item.query) {
      router.push("/simulate?concept=" + encodeURIComponent(item.query));
    } else if (item.type === "test") {
      router.push("/test");
    } else if (item.type === "tutor") {
      router.push("/tutor");
    } else {
      router.push("/dashboard");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return days + " days ago";
    if (days < 30) return Math.floor(days / 7) + " week" + (days >= 14 ? "s" : "") + " ago";
    return Math.floor(days / 30) + " month" + (days >= 60 ? "s" : "") + " ago";
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Bookmarks</h1>
        <p className="text-sm text-slate-400">Your saved learning content</p>
      </div>
      <div className="flex gap-2 mb-6">
        {tabs.map((t) => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={["px-4 py-2 rounded-xl text-sm font-medium transition-all border", activeTab === t ? "bg-purple-500/20 border-purple-500/30 text-purple-300" : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"].join(" ")}>
            {t}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <Bookmark size={32} className="text-slate-600 mx-auto mb-4" />
          <p className="text-slate-500 text-sm">No bookmarks yet</p>
          <p className="text-slate-600 text-xs mt-1">Bookmark simulations, tests, or tutor chats to find them here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => {
            const Icon = typeIcons[item.type] || Atom;
            return (
              <Card key={item.id} className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-xl bg-white/5">
                    <Icon size={18} className="text-purple-400" />
                  </div>
                  <Badge variant={typeBadge[item.type] || "purple"}>{item.type}</Badge>
                </div>
                <h3 className="text-sm font-semibold text-white mb-1 line-clamp-2">{item.title}</h3>
                <p className="text-xs text-slate-500 mb-4">{item.subject || "General"} &bull; Saved {formatDate(item.savedAt)}</p>
                <div className="flex gap-2">
                  <button onClick={() => handleOpen(item)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white hover:bg-white/10 transition-all">
                    <ExternalLink size={12} /> Open
                  </button>
                  <button onClick={() => handleDelete(item.id)}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}