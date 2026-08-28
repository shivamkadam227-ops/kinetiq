"use client";
import WelcomeHeader from "@/components/dashboard/WelcomeHeader";
import AICommandBar from "@/components/dashboard/AICommandBar";
import QuickActions from "@/components/dashboard/QuickActions";
import ContinueLearning from "@/components/dashboard/ContinueLearning";
import RecentSimulations from "@/components/dashboard/RecentSimulations";
import LearningStreak from "@/components/dashboard/LearningStreak";
import WeeklyProgress from "@/components/dashboard/WeeklyProgress";
import UpcomingTest from "@/components/dashboard/UpcomingTest";
import SubjectProgress from "@/components/dashboard/SubjectProgress";

export default function DashboardPage() {
  return (
    <div className="flex flex-col xl:flex-row gap-6 p-4 sm:p-6">
      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <WelcomeHeader />
        <AICommandBar />
        <QuickActions />
        <ContinueLearning />
        <RecentSimulations />
      </div>
      {/* Right Panel */}
      <div className="w-full xl:w-[340px] flex-shrink-0">
        <LearningStreak />
        <WeeklyProgress />
        <UpcomingTest />
        <SubjectProgress />
      </div>
    </div>
  );
}