"use client";

import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/providers/SupabaseAuthProvider";

export default function AuthLayoutWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const isSignedIn = !!user;
  const isLoaded = !isLoading;

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <>
      {isSignedIn ? (
        <>
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto p-8">
              {children}
            </div>
          </main>
        </>
      ) : (
        <main className="flex-1 w-full h-full">
          {children}
        </main>
      )}
    </>
  );
}
