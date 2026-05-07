"use client";

import { Settings, Bell, Shield, Database, Globe, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { useRouter } from "next/navigation";

export default function AdminSettingsPage() {
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
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Paramètres du Système</h1>
        <p className="text-slate-500 text-sm mt-1">Configurez les variables globales et la sécurité du portail.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Navigation */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { label: "Général", icon: Globe, active: true },
            { label: "Notifications", icon: Bell, active: false },
            { label: "Sécurité", icon: Shield, active: false },
            { label: "Base de données", icon: Database, active: false },
          ].map((item, i) => (
            <button 
              key={i}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${item.active ? 'bg-white text-emerald-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 space-y-8">
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">Configuration Générale</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Nom du Portail</label>
                  <input type="text" defaultValue="CRI Smart Portal" className="w-full bg-slate-50 border-transparent rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email de Contact Support</label>
                  <input type="email" defaultValue="support@cri.ma" className="w-full bg-slate-50 border-transparent rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all" />
                </div>

                <div className="flex items-center justify-between py-4 border-t border-slate-100">
                  <div>
                    <p className="text-sm font-bold text-slate-900">Maintenance du Site</p>
                    <p className="text-xs text-slate-500">Désactiver l'accès aux investisseurs pendant les mises à jour.</p>
                  </div>
                  <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all"></div>
                  </div>
                </div>
              </div>
            </div>

            <button className="flex items-center justify-center gap-2 w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20">
              <Save className="w-5 h-5" />
              Enregistrer les modifications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
