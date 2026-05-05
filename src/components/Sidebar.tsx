"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createBrowserClient } from '@supabase/ssr'
import { 
  LayoutDashboard, 
  Briefcase, 
  PlusCircle, 
  HelpCircle, 
  Calendar, 
  FileText,
  Search,
  LogIn,
  UserPlus,
  LogOut,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Tableau de bord", href: "/", icon: LayoutDashboard },
  { name: "Mes projets", href: "/projets", icon: Briefcase },
  { name: "Nouveau projet", href: "/projets/nouveau", icon: PlusCircle },
  { name: "Procédures", href: "/procedures", icon: FileText },
  { name: "Rendez-vous", href: "/rendez-vous", icon: Calendar },
  { name: "FAQ", href: "/faq", icon: HelpCircle },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsSignedIn(!!session);
      setIsLoaded(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsSignedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <Link href="/" className="block">
          <Image 
            src="/cri-logo.png" 
            alt="CRI Logo" 
            width={160} 
            height={64} 
            className="w-auto h-12 object-contain" 
            priority
          />
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-emerald-50 text-emerald-700 shadow-sm" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-emerald-700" : "text-slate-400")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto space-y-4">
        {isLoaded && isSignedIn && (
          <div className="flex flex-col gap-2">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-100 p-2 rounded-full text-emerald-700">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-900">Mon Compte</span>
                  <span className="text-xs text-slate-500">Gérer le profil</span>
                </div>
              </div>
            </div>
            <button onClick={handleSignOut} className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-medium transition-colors">
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        )}

        {isLoaded && !isSignedIn && (
          <div className="flex flex-col gap-2">
            <Link 
              href="/sign-in"
              className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-medium transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Connexion
            </Link>
            <Link 
              href="/sign-up"
              className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-white border border-emerald-600 text-emerald-700 hover:bg-emerald-50 rounded-xl text-sm font-medium transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              S'inscrire
            </Link>
          </div>
        )}

        <div className="bg-slate-900 rounded-2xl p-4 text-white">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Aide IA</p>
          <p className="text-sm text-slate-200 mb-3">Besoin d'aide pour votre investissement ?</p>
          <Link 
            href="/procedures"
            className="block w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-center rounded-lg text-sm font-medium transition-colors"
          >
            Consulter l'IA
          </Link>
        </div>
      </div>
    </div>
  );
}
