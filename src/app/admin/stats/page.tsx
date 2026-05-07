"use client";

import { BarChart3, TrendingUp, TrendingDown, Users, Briefcase, DollarSign, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { useRouter } from "next/navigation";

export default function AdminStatsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!user || user.user_metadata?.role !== 'admin')) {
      if (user?.email !== "admin@cri.ma") {
        router.push("/admin");
      }
    }
  }, [user, authLoading, router]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Statistiques et Analyses</h1>
        <p className="text-slate-500 text-sm mt-1">Analyse approfondie des investissements dans la région.</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Volume d'Investissement", value: "1.2B DH", change: "+8.4%", icon: DollarSign, color: "bg-emerald-50 text-emerald-600" },
          { label: "Projets Soumis", value: "142", change: "+12.1%", icon: Briefcase, color: "bg-blue-50 text-blue-600" },
          { label: "Nouveaux Utilisateurs", value: "24", change: "-2.3%", icon: Users, color: "bg-purple-50 text-purple-600" },
          { label: "Emplois Projetés", value: "3,420", change: "+15.2%", icon: TrendingUp, color: "bg-amber-50 text-amber-600" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
            <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <span className={`text-xs font-bold ${stat.change.startsWith('+') ? 'text-emerald-600' : 'text-red-500'}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm min-h-[400px] flex flex-col items-center justify-center text-center">
          <div className="p-4 bg-slate-50 rounded-full mb-4">
            <BarChart3 className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Répartition par Secteur</h3>
          <p className="text-sm text-slate-500 max-w-xs">Visualisation graphique des investissements par secteur d'activité (Industrie, Tourisme, Services, etc.)</p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm min-h-[400px] flex flex-col items-center justify-center text-center">
          <div className="p-4 bg-slate-50 rounded-full mb-4">
            <Calendar className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Évolution Temporelle</h3>
          <p className="text-sm text-slate-500 max-w-xs">Courbe de progression des dossiers et des volumes d'investissement sur les 12 derniers mois.</p>
        </div>
      </div>
    </div>
  );
}
