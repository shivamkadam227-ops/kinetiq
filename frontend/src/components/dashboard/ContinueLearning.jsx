"use client";
import { useRouter } from "next/navigation";
import { Play, MessageSquareText, Eye } from "lucide-react";
import { continueLearning } from "@/lib/mockData";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";

const typeMap = { simulation: "purple", tutor: "cyan", test: "green" };
const actionIcons = { Resume: Play, "Continue Chat": MessageSquareText, "Review Results": Eye };
const actionRoutes = { simulation: "/simulate", tutor: "/tutor", test: "/test" };

export default function ContinueLearning() {
  const router = useRouter();
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Continue Learning</h2>
        <button className="text-xs text-purple-400 hover:text-purple-300 transition-colors">View All</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {continueLearning.map((item) => {
          const ActionIcon = actionIcons[item.action] || Play;
          return (
            <div key={item.id} className="group bg-[#0f1129]/80 border border-white/[0.06] rounded-2xl overflow-hidden hover:border-purple-500/20 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300">
              <div className={"h-28 bg-gradient-to-br " + item.gradient + " relative flex items-center justify-center"}>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9zdmc+')] opacity-50" />
                <Badge variant={typeMap[item.type] || "default"} className="absolute top-3 left-3 text-[10px] capitalize">{item.type === "tutor" ? "AI Tutor" : item.type === "test" ? "Test" : "Simulation"}</Badge>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-white mb-1 truncate">{item.title}</h3>
                <p className="text-xs text-slate-500 mb-3">{item.subject} &bull; {item.topic}</p>
                <ProgressBar value={item.progress} color="#8b5cf6" size="sm" />
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-slate-400">{item.progress}%</span>
                  <button
                    onClick={() => router.push(actionRoutes[item.type] || "/dashboard")}
                    className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors"
                  >
                    <ActionIcon size={12} /> {item.action}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}