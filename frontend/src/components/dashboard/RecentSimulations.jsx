"use client";
import { useRouter } from "next/navigation";
import { Play } from "lucide-react";
import { recentSimulations } from "@/lib/mockData";

export default function RecentSimulations() {
  const router = useRouter();
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Recent Simulations</h2>
        <button className="text-xs text-purple-400 hover:text-purple-300 transition-colors">View All</button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {recentSimulations.map((sim) => (
          <button
            key={sim.id}
            onClick={() => router.push("/simulate?concept=" + encodeURIComponent(sim.title))}
            className="group bg-[#0f1129]/80 border border-white/[0.06] rounded-2xl overflow-hidden hover:border-purple-500/20 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300 text-left"
          >
            <div className={"h-32 bg-gradient-to-br " + sim.gradient + " relative flex items-center justify-center"}>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9zdmc+')] opacity-50" />
              <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:bg-purple-500/30 transition-all duration-300">
                <Play size={20} className="text-white ml-0.5" />
              </div>
            </div>
            <div className="p-3">
              <h3 className="text-sm font-medium text-white truncate">{sim.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{sim.timestamp}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}