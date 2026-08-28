"use client";
import { Show } from "@clerk/nextjs";
import AppShell from "@/components/layout/AppShell";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

function RequireAuth({ children }) {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (isLoaded && !isSignedIn) router.replace("/");
  }, [isLoaded, isSignedIn, router]);
  if (!isLoaded || !isSignedIn) return null;
  return children;
}

export default function DashboardLayout({ children }) {
  return (
    <RequireAuth>
      <AppShell>{children}</AppShell>
    </RequireAuth>
  );
}