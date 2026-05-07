"use client";

import { Users, Search, Filter, MoreVertical, Mail, Shield, UserCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { useRouter } from "next/navigation";

export default function UsersManagementPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [profiles, setProfiles] = useState<any[]>([]);
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
    async function fetchProfiles() {
      setIsLoading(true);
      setError("");
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*');
          // .order('created_at', { ascending: false }); // Wait for migration

        if (error) {
          console.error("Error fetching profiles:", error);
          setError(error.message);
        }
        setProfiles(data || []);
      } catch (err: any) {
        console.error("Error fetching profiles:", err);
        setError(err.message || "Erreur lors du chargement des profils.");
      } finally {
        setIsLoading(false);
      }
    }

    if (user) fetchProfiles();
  }, [user]);

  const [error, setError] = useState("");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gestion des Utilisateurs</h1>
        <p className="text-slate-500 text-sm mt-1">Gérez les comptes investisseurs et les permissions.</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm flex items-center gap-3">
          <Shield className="w-5 h-5 shrink-0" />
          <p><strong>Erreur de chargement :</strong> {error}. Vérifiez que la table 'profiles' est accessible.</p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Utilisateurs</p>
              <p className="text-2xl font-bold text-slate-900">{profiles.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Comptes Actifs</p>
              <p className="text-2xl font-bold text-slate-900">{profiles.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Administrateurs</p>
              <p className="text-2xl font-bold text-slate-900">1</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Rechercher un utilisateur..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all">
            <Filter className="w-4 h-4" />
            Filtrer
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Utilisateur</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Email</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Rôle</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Date d'inscription</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {profiles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-400">
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              ) : (
                profiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                          {profile.first_name?.[0]}{profile.last_name?.[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{profile.first_name} {profile.last_name}</p>
                          <p className="text-xs text-slate-500">{profile.company || 'Investisseur Individuel'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail className="w-4 h-4 text-slate-400" />
                        {profile.email || 'N/A'}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        Investisseur
                      </span>
                    </td>
                    <td className="px-8 py-6 text-sm text-slate-500">
                      {profile.created_at ? new Date(profile.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                    </td>
                    <td className="px-8 py-6">
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5 text-slate-400" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
