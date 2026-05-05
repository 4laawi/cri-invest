"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import { Search, Briefcase, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export default function ProjectList() {
  const projects = useQuery(api.projects.getProjects);
  const [search, setSearch] = useState("");

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
      </div>

      <div className="grid gap-4">
        {!projects ? (
          [1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-slate-200 animate-pulse rounded-2xl" />)
        ) : filteredProjects?.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-2 bg-transparent">
            <p className="text-slate-500">Aucun projet ne correspond à votre recherche.</p>
          </Card>
        ) : (
          filteredProjects?.map((project) => (
            <Link key={project._id} href={`/projets/${project._id}`}>
              <Card className="p-5 hover:border-emerald-200 transition-all group">
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
                        <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <Badge 
                      variant={
                        project.status === "Analysé" ? "success" : 
                        project.status === "Soumis" ? "info" : "default"
                      }
                    >
                      {project.status}
                    </Badge>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                  </div>
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
