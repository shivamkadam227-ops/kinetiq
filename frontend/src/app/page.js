"use client";
import { Show, SignInButton, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sparkles } from "lucide-react";
import AppShell from "@/components/layout/AppShell";

function AuthRedirect({ children }) {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (isLoaded && isSignedIn) router.replace("/dashboard");
  }, [isLoaded, isSignedIn, router]);
  if (!isLoaded) return null;
  if (isSignedIn) return null;
  return children;
}

export default function Home() {
  return (
    <>
      <Show when="signed-out">
        <AuthRedirect>
          <main className="flex-1 flex flex-col items-center justify-center relative overflow-hidden min-h-screen">
            {/* Orbs */}
            <div className="absolute w-[400px] h-[400px] rounded-full bg-purple-600/20 blur-[100px] top-[-100px] left-[-100px]" />
            <div className="absolute w-[350px] h-[350px] rounded-full bg-indigo-600/20 blur-[100px] bottom-[-80px] right-[-80px]" />

            <div className="relative z-10 flex flex-col items-center text-center px-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl mb-8 shadow-2xl shadow-purple-500/30">K</div>
              <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6">
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">KinetiQ</span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mb-4 leading-relaxed">
                Transform any scientific or technical concept into a <span className="text-indigo-400 font-medium">dynamic, interactive simulation</span> — powered by AI.
              </p>
              <p className="text-sm text-slate-500 mb-10">Physics &bull; Chemistry &bull; Data Structures &bull; Astronomy &bull; Biology &bull; and more</p>
              <SignInButton mode="modal">
                <button className="px-8 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl text-white text-base font-medium flex items-center gap-2.5 hover:shadow-2xl hover:shadow-purple-500/30 hover:-translate-y-0.5 transition-all">
                  <Sparkles size={20} /> Get Started
                </button>
              </SignInButton>
            </div>
          </main>
        </AuthRedirect>
      </Show>

      <Show when="signed-in">
        <RedirectToDashboard />
      </Show>
    </>
  );
}

function RedirectToDashboard() {
  const router = useRouter();
  useEffect(() => { router.replace("/dashboard"); }, [router]);
  return null;
}