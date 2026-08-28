"use client";
export default function WelcomeHeader({ userName = "Shivam" }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  return (
    <div className="mb-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
        {greeting}, <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{userName}</span>! 👋
      </h1>
      <p className="text-slate-400 text-sm">What do you want to learn or explore today?</p>
    </div>
  );
}