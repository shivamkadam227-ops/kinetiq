"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Atom, MessageSquareText, ClipboardCheck, Trash2, ExternalLink } from "lucide-react";
import { savedBookmarks } from "@/lib/mockData";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

const tabs = ["All", "Simulations", "Tests", "Tutor Chats"];
const typeFilters = { All: null, Simulations: "simulation", Tests: "test", "Tutor Chats": "tutor" };
const typeIcons = { simulation: Atom, test: ClipboardCheck, tutor: MessageSquareText };
const typeBadge = { simulation: "purple", test: "green", tutor: "cyan" };
const typeRoutes = { simulation: "/simulate", test: "/test", tutor: "/tutor" };

export default function BookmarksPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [items, setItems] = useState(savedBookmarks);
  const router = useRouter();

  const filtered = typeFilters[activeTab] ? items.filter((i) => i.type === typeFilters[activeTab]) : items;

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
        <div className="text-center py-20 text-slate-500 text-sm">No bookmarks found</div>
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
                  <Badge variant={typeBadge[item.type]}>{item.type}</Badge>
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">{item.title}</h3>
                <p className="text-xs text-slate-500 mb-4">{item.subject} &bull; Saved {item.savedAt}</p>
                <div className="flex gap-2">
                  <button onClick={() => router.push(typeRoutes[item.type] || "/dashboard")}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white hover:bg-white/10 transition-all">
                    <ExternalLink size={12} /> Open
                  </button>
                  <button onClick={() => setItems((prev) => prev.filter((i) => i.id !== item.id))}
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