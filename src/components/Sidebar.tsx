import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { 
  LayoutDashboard, 
  Briefcase, 
  HelpCircle, 
  Calendar, 
  FileText,
  LogIn,
  UserPlus,
  LogOut,
  User,
  Users,
  Settings,
  BarChart3,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

const userMenuItems = [
  { name: "Tableau de bord", href: "/", icon: LayoutDashboard },
  { name: "Mes projets", href: "/projets", icon: Briefcase },
  { name: "Procédures", href: "/procedures", icon: FileText },
  { name: "Rendez-vous", href: "/rendez-vous", icon: Calendar },
  { name: "FAQ", href: "/faq", icon: HelpCircle },
];

const adminMenuItems = [
  { name: "Tableau de bord", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Gestion des Dossiers", href: "/admin/dossiers", icon: Briefcase },
  { name: "Utilisateurs", href: "/admin/users", icon: Users },
  { name: "Statistiques", href: "/admin/stats", icon: BarChart3 },
  { name: "Paramètres", href: "/admin/settings", icon: Settings },
];

const userGeneralItems = [
  { name: "Mon Profil", href: "/profile", icon: User },
  { name: "Aide", href: "/aide", icon: HelpCircle },
];

const adminGeneralItems = [
  { name: "Profil Admin", href: "/admin/profile", icon: ShieldCheck },
  { name: "Logs Système", href: "/admin/logs", icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, isLoading, signOut } = useAuth();
  const isAdmin = user?.user_metadata?.role === 'admin' || user?.email === 'admin@cri.ma';
  const menuItems = isAdmin ? adminMenuItems : userMenuItems;
  const generalItems = isAdmin ? adminGeneralItems : userGeneralItems;
  
  const isSignedIn = !!user;
  const isLoaded = !isLoading;

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="w-64 bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0 py-6">
      <div className="px-8 mb-8">
        <Link href="/" className="block">
          <Image 
            src="/cri-logo.png" 
            alt="CRI Logo" 
            width={140} 
            height={50} 
            className="w-auto h-10 object-contain" 
            priority
          />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] space-y-8">
        {/* MENU Section */}
        <div>
          <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Menu</p>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 relative group",
                    isActive 
                      ? "text-slate-900 bg-slate-50/50 rounded-xl" 
                      : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#1B4332] rounded-r-full"></div>
                  )}
                  <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-[#1B4332]" : "text-slate-400 group-hover:text-slate-600")} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* GENERAL Section */}
        <div>
          <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Général</p>
          <nav className="space-y-1">
            {generalItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 relative group",
                    isActive 
                      ? "text-slate-900 bg-slate-50/50 rounded-xl" 
                      : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#1B4332] rounded-r-full"></div>
                  )}
                  <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-[#1B4332]" : "text-slate-400 group-hover:text-slate-600")} />
                  {item.name}
                </Link>
              );
            })}
            {isLoaded && isSignedIn && (
              <button 
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-500 hover:text-red-600 transition-colors rounded-xl hover:bg-red-50/50 group"
              >
                <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-500 transition-colors" />
                Déconnexion
              </button>
            )}
          </nav>
        </div>
      </div>

      <div className="p-6 mt-auto">
        {isLoaded && !isSignedIn && (
          <div className="flex flex-col gap-2 mb-4">
            <Link 
              href="/"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#1B4332] hover:bg-[#143226] text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              Connexion
            </Link>
            <Link 
              href="/sign-up"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-sm font-medium transition-colors shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              S'inscrire
            </Link>
          </div>
        )}

        {/* AI Banner / Admin Badge */}
        {isAdmin ? (
          <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white p-6 shadow-lg min-h-[160px] flex flex-col group/banner border border-slate-800">
             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
             <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="bg-emerald-500/20 p-2.5 rounded-xl self-start border border-emerald-500/30">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold mb-1 text-white">Mode Admin Activé</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                    Vous avez un accès complet aux outils de gestion du portail.
                  </p>
                </div>
             </div>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-2xl text-white p-6 shadow-lg min-h-[220px] flex flex-col group/banner">
            {/* Background Image */}
            <div className="absolute inset-0 bg-[url('/image.png')] bg-cover bg-center transition-transform duration-700 group-hover/banner:scale-105"></div>
            
            {/* Lighter Gradient Overlay - Only dark at the very bottom for text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            <div className="relative z-10 flex flex-col items-start text-left h-full justify-between mt-auto">
              <div className="bg-white/20 backdrop-blur-md p-2.5 rounded-xl mb-4 shadow-sm border border-white/20">
                <HelpCircle className="w-5 h-5 text-emerald-300" />
              </div>
              
              <div className="w-full mt-auto">
                <h4 className="text-base font-bold mb-1.5 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Assistant IA CRI</h4>
                <p className="text-xs text-white mb-5 leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-medium">
                  Obtenez de l'aide pour vos procédures en un clic.
                </p>
                <Link 
                  href="/procedures"
                  className="flex items-center justify-center w-full bg-[#1B4332]/80 hover:bg-[#1B4332] backdrop-blur-md text-white text-xs text-center py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg border border-emerald-500/30"
                >
                  Consulter l'IA
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
