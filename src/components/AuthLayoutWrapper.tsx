"use client";

import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Loader2 } from "lucide-react";
import { createBrowserClient } from '@supabase/ssr'

export default function AuthLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsSignedIn(!!session);
      setIsLoaded(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsSignedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

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
