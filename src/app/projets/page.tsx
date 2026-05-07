"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Briefcase, ChevronRight, Plus, Loader2, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export default function ProjectList() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [projects, setProjects] = useState<any[] | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchProjects() {
      if (!user) return;
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error) setProjects(data);
      setIsFetching(false);
    }
    if (!authLoading) {
      if (user) fetchProjects();
      else setIsFetching(false);
    }
  }, [user, authLoading]);

  if (authLoading || isFetching) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#1B4332]" />
        <p className="text-slate-500 font-medium animate-pulse">Vérification de l'accès...</p>
      </div>
    );
  }


  const filteredProjects = projects?.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sector.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mes projets</h1>
          <p className="text-slate-500 mt-1">Gérez tous vos dossiers d'investissement.</p>
        </div>
        <div className="flex items-center gap-4">
          {projects && projects.length > 0 && (
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher un projet..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm"
              />
            </div>
          )}
          <Link 
            href="/projets/nouveau" 
            className="bg-[#1B4332] text-white px-5 py-2 rounded-xl font-medium text-sm flex items-center gap-2 hover:bg-[#143226] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nouveau Projet
          </Link>
        </div>
      </div>

      <div className="grid gap-4">
        {!projects || projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-600 mb-6">
              <Briefcase className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Aucun projet pour le moment</h2>
            <p className="text-slate-500 max-w-sm mb-8">
              Vous n'avez pas encore créé de projet. Commencez dès maintenant à gérer vos dossiers d'investissement.
            </p>
            <Link 
              href="/projets/nouveau" 
              className="bg-[#1B4332] text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 hover:bg-[#143226] transition-all hover:scale-[1.02] shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Lancer mon premier projet
            </Link>
          </div>
        ) : filteredProjects?.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-2 bg-transparent">
            <p className="text-slate-500">Aucun projet ne correspond à votre recherche "{search}".</p>
          </Card>
        ) : (
          filteredProjects?.map((project) => (
            <Card 
              key={project.id} 
              className="p-5 hover:border-emerald-200 transition-all group relative overflow-hidden cursor-pointer"
              onClick={() => router.push(`/projets/${project.id}`)}
            >
              {project.status === "Soumis" && (
                <div className="absolute top-0 left-0 h-1 bg-emerald-500/20 w-full overflow-hidden">
                  <div className="h-full bg-emerald-500 animate-progress-indefinite w-1/3" />
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg group-hover:text-emerald-700 transition-colors">
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span>{project.sector}</span>
                      <span>•</span>
                      <span>{project.budget.toLocaleString()} MAD</span>
                      <span>•</span>
                      <span>{new Date(project.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <Badge 
                      variant={
                        project.status === "Analysé" ? "success" : 
                        project.status === "Soumis" ? "info" : 
                        project.status === "Brouillon" ? "warning" : "default"
                      }
                      className={project.status === "Soumis" ? "animate-pulse" : ""}
                    >
                      {project.status === "Soumis" ? "Analyse en cours..." : 
                       project.status === "Brouillon" ? "Brouillon" : 
                       project.status}
                    </Badge>
                    {project.status === "Soumis" && (
                      <p className="text-[10px] text-emerald-600 mt-1 font-medium">IA en action</p>
                    )}
                    {project.status === "Brouillon" && (
                      <p className="text-[10px] text-orange-600 mt-1 font-medium">À compléter</p>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                </div>
              </div>

              {project.status === "Brouillon" && (
                <div 
                  className="mt-5 pt-4 border-t border-slate-100 flex justify-between items-center bg-orange-50/30 -mx-5 px-5 -mb-5 pb-5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-2 text-orange-700">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-xs font-medium">Ce dossier n'est pas encore finalisé.</span>
                  </div>
                  <Link 
                    href={`/projets/nouveau?id=${project.id}`}
                    className="text-xs bg-orange-100 text-orange-700 px-4 py-2 rounded-lg font-bold hover:bg-orange-200 transition-colors"
                  >
                    Continuer le remplissage
                  </Link>
                </div>
              )}

              {project.status === "Soumis" && (
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-end mb-2">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest block">Analyse Stratégique</span>
                      <p className="text-[11px] text-slate-500 font-medium">L'IA évalue la viabilité de votre projet...</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">85%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden p-0.5 border border-slate-200/50">
                    <div className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 h-full w-[85%] rounded-full shadow-[0_0_12px_rgba(16,185,129,0.3)] relative">
                      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
