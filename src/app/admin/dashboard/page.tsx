"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { useRouter } from "next/navigation";
import { 
  Users, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  ArrowRight,
  Loader2,
  Calendar,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    analysed: 0,
    validated: 0
  });
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!user || user.user_metadata?.role !== 'admin')) {
      if (user?.email !== "admin@cri.ma") {
        router.push("/admin");
      }
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (projectsData) {
          const publicProjects = projectsData.filter(p => p.status !== "Brouillon");
          setStats({
            total: publicProjects.length,
            pending: publicProjects.filter(p => p.status === "En attente").length,
            analysed: publicProjects.filter(p => p.status === "En cours de traitement").length,
            validated: publicProjects.filter(p => p.status === "Validé").length,
          });
          setRecentProjects(publicProjects.slice(0, 5));
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    if (user) fetchData();
  }, [user]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Tableau de bord Admin</h1>
          <p className="text-slate-500 text-sm mt-1">Aperçu global de l'activité du portail d'investissement.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="pr-4">
            <p className="text-xs font-bold text-slate-900">Session Administrateur</p>
            <p className="text-[10px] text-slate-500 font-medium italic">Accès Total Sécurisé</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Dossiers Totaux", value: stats.total, icon: Briefcase, color: "bg-blue-500" },
          { label: "En Attente", value: stats.pending, icon: Clock, color: "bg-amber-500" },
          { label: "Analysés", value: stats.analysed, icon: TrendingUp, color: "bg-emerald-500" },
          { label: "Validés", value: stats.validated, icon: CheckCircle2, color: "bg-indigo-500" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${stat.color} text-white shadow-lg transition-transform group-hover:scale-110`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Projects */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">Dossiers Récents</h3>
            <Link href="/admin/dossiers" className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              Voir tout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex-1">
            <div className="divide-y divide-slate-50">
              {recentProjects.length === 0 ? (
                <div className="p-20 text-center text-slate-400">Aucun dossier récent.</div>
              ) : (
                recentProjects.map((project) => (
                  <div key={project.id} className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                        <Briefcase className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{project.name}</p>
                        <p className="text-xs text-slate-500">{project.sector} • {project.region}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                      ${project.status === "Validé" ? 'bg-emerald-100 text-emerald-700' : 
                        project.status === "Analysé" ? 'bg-blue-100 text-blue-700' :
                        project.status === "Soumis" ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-600'}`}>
                      {project.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions / Calendar */}
        <div className="bg-[#1B4332] rounded-[2.5rem] p-8 text-white shadow-xl flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
          
          <div className="relative z-10">
            <div className="bg-white/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border border-white/20">
              <Calendar className="w-6 h-6 text-emerald-300" />
            </div>
            <h3 className="text-xl font-bold mb-2">Prochaines Échéances</h3>
            <p className="text-emerald-100/70 text-sm leading-relaxed mb-8">
              Consultez le calendrier des commissions de validation régionales.
            </p>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 mb-1">Commission Regionale</p>
              <p className="text-sm font-semibold">12 Mai 2026 - 10:00</p>
            </div>
            <button className="w-full bg-white text-[#1B4332] py-4 rounded-2xl font-bold hover:bg-emerald-50 transition-all shadow-lg">
              Ouvrir le Calendrier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
