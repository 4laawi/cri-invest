"use client";

import { FileText, Shield, Clock, Search, Filter, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { useRouter } from "next/navigation";

export default function AdminLogsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!user || user.user_metadata?.role !== 'admin')) {
      if (user?.email !== "admin@cri.ma") {
        router.push("/admin");
      }
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
      </div>
    );
  }

  const mockLogs = [
    { id: 1, action: "Connexion Administrateur", user: "admin@cri.ma", ip: "192.168.1.45", date: "Il y a 5 min", status: "Succès" },
    { id: 2, action: "Validation de Dossier", user: "admin@cri.ma", details: "Projet Solaire Ouarzazate", date: "Il y a 1 heure", status: "Succès" },
    { id: 3, action: "Modification de Profil", user: "m.alami@gmail.com", details: "Mise à jour coordonnées", date: "Il y a 2 heures", status: "Succès" },
    { id: 4, action: "Tentative de Connexion échouée", user: "unknown", ip: "45.12.89.1", date: "Il y a 4 heures", status: "Alerte" },
    { id: 5, action: "Nouveau Projet Soumis", user: "k.benali@tech.ma", details: "Smart Agri Laâyoune", date: "Hier à 16:45", status: "Succès" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight text-white/0 bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500">Journal d'Audit</h1>
        <p className="text-slate-500 text-sm mt-1">Traçabilité complète des actions effectuées sur la plateforme.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold">Tous les logs</button>
            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50">Erreurs</button>
            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50">Sécurité</button>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Rechercher..." className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/20 outline-none w-64" />
            </div>
            <button className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              <Filter className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Événement</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Utilisateur</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date / Heure</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {mockLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${log.status === 'Alerte' ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-500'}`}>
                        {log.status === 'Alerte' ? <Shield className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{log.action}</p>
                        <p className="text-[10px] text-slate-500">{log.details || log.ip}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm text-slate-600 font-medium">{log.user}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      {log.date}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${log.status === 'Alerte' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'}`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-center">
          <button className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">Afficher plus d'événements</button>
        </div>
      </div>
    </div>
  );
}
