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
  Search, 
  Filter,
  MoreVertical,
  Calendar,
  AlertCircle,
  Loader2,
  TrendingUp
} from "lucide-react";

export default function AdminDossiersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState("");
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
      setError("");
      try {
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .neq('status', 'Brouillon')
          .order('created_at', { ascending: false });

        if (projectsError) throw projectsError;
        setProjects(projectsData || []);

        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*');
        
        if (profilesError) throw profilesError;
        setProfiles(profilesData || []);

      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "Erreur lors du chargement des données.");
      } finally {
        setIsLoading(false);
      }
    }

    if (user) fetchData();
  }, [user]);

  const handleUpdateStatus = async (projectId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: newStatus })
        .eq('id', projectId);

      if (error) throw error;

      setProjects(projects.map(p => p.id === projectId ? { ...p, status: newStatus } : p));
    } catch (err: any) {
      console.error("Status update error:", err);
      alert(`Erreur lors de la mise à jour du statut : ${err.message || "Erreur inconnue"}`);
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.user_id?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gestion des Dossiers</h1>
          <p className="text-slate-500 text-sm mt-1">Consultez et traitez les demandes d'investissement.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p><strong>Erreur :</strong> {error}</p>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Rechercher par nom de projet ou ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all shadow-sm"
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-2xl px-6 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium text-slate-700 shadow-sm cursor-pointer"
          >
            <option value="all">Tous les statuts</option>
            <option value="En attente">En attente</option>
            <option value="En cours de traitement">En cours</option>
            <option value="Validé">Validé</option>
            <option value="Rejeté">Rejeté</option>
          </select>
          <button className="bg-white border border-slate-200 rounded-2xl p-3.5 text-slate-500 hover:text-slate-900 transition-colors shadow-sm">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Investisseur / Projet</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Budget / Emplois</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Statut Actuel</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-slate-400">
                    <div className="flex flex-col items-center">
                      <Briefcase className="w-12 h-12 mb-4 opacity-20" />
                      <p>Aucun dossier trouvé.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => {
                  const projectUser = profiles.find(u => u.id === project.user_id);
                  return (
                    <tr 
                      key={project.id} 
                      className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                      onClick={() => router.push(`/admin/dossiers/${project.id}`)}
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform">
                            <Briefcase className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{project.name}</p>
                            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                              <Users className="w-3 h-3" />
                               {projectUser ? `${projectUser.first_name} ${projectUser.last_name}` : `ID: ${project.user_id?.substring(0, 8) || 'Inconnu'}...`}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-bold text-slate-900">{project.budget?.toLocaleString()} DH</p>
                        <p className="text-xs text-slate-500 mt-0.5">{project.estimated_jobs} emplois</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                          ${project.status === "Validé" ? 'bg-emerald-100 text-emerald-700' : 
                            project.status === "En cours de traitement" ? 'bg-blue-100 text-blue-700' :
                            project.status === "En attente" ? 'bg-amber-100 text-amber-700' :
                            project.status === "Rejeté" ? 'bg-red-100 text-red-700' :
                            'bg-slate-100 text-slate-600'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            project.status === "Validé" ? 'bg-emerald-500' : 
                            project.status === "En cours de traitement" ? 'bg-blue-500' : 
                            project.status === "En attente" ? 'bg-amber-500' : 
                            project.status === "Rejeté" ? 'bg-red-500' :
                            'bg-slate-400'}`}></span>
                          {project.status === "En attente" ? "En attente" : project.status}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <button 
                            onClick={() => router.push(`/admin/dossiers/${project.id}`)}
                            className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
                            title="Voir les détails"
                          >
                            <TrendingUp className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(project.id, "Validé")}
                            className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors"
                            title="Valider"
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
