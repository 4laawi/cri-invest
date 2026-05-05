"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useParams } from "next/navigation";
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ArrowLeft, 
  TrendingUp, 
  ListChecks, 
  Lightbulb,
  ShieldAlert,
  Calendar
} from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ProjectDetail() {
  const params = useParams();
  const projectId = params.id as any;

  const project = useQuery(api.projects.getProject, { id: projectId });
  const analysis = useQuery(api.analysis.getAnalysisByProjectId, { projectId });

  if (!project) return (
    <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      <Link href="/projets" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" />
        Retour aux projets
      </Link>

      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
            <Badge 
              variant={
                project.status === "Analysé" ? "success" : 
                project.status === "Soumis" ? "info" : "default"
              }
              className="text-sm px-3 py-1"
            >
              {project.status}
            </Badge>
          </div>
          <p className="text-slate-500 max-w-2xl">{project.description}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400 font-medium">Investissement estimé</p>
          <p className="text-2xl font-bold text-slate-900">{project.budget.toLocaleString()} MAD</p>
        </div>
      </div>

      {!analysis && project.status === "Soumis" && (
        <Card className="p-12 text-center bg-emerald-50 border-emerald-100">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700"></div>
            <div>
              <h3 className="text-lg font-bold text-emerald-900">Analyse IA en cours...</h3>
              <p className="text-emerald-700">Notre moteur d'intelligence artificielle évalue la viabilité de votre projet.</p>
            </div>
          </div>
        </Card>
      )}

      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Score & Risk */}
            <div className="grid grid-cols-2 gap-4">
               <Card className="p-6 bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-none">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-5 h-5 text-emerald-200" />
                  <h3 className="font-bold">Score de Viabilité</h3>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-bold">{analysis.score}</span>
                  <span className="text-emerald-200 mb-2 font-medium">/ 100</span>
                </div>
                <p className="text-emerald-100 text-sm mt-4">Un score élevé indique une forte adéquation avec les besoins régionaux.</p>
              </Card>

              <Card className="p-6 border-none shadow-sm bg-white">
                 <div className="flex items-center gap-3 mb-4">
                  <ShieldAlert className="w-5 h-5 text-orange-500" />
                  <h3 className="font-bold text-slate-900">Niveau de Risque</h3>
                </div>
                <Badge variant="warning" className="text-lg px-4 py-1 rounded-xl">
                  {analysis.risk_level}
                </Badge>
                <p className="text-slate-500 text-sm mt-4">Délai estimé: <span className="font-bold text-slate-900">{analysis.estimated_timeline}</span></p>
              </Card>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Points Forts
                </h3>
                <ul className="space-y-3">
                  {analysis.strengths.map((s, i) => (
                    <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  Défis à Relever
                </h3>
                <ul className="space-y-3">
                  {analysis.weaknesses.map((w, i) => (
                    <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                      {w}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* Recommendations */}
            <Card className="p-6">
               <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                Recommandations Stratégiques
              </h3>
              <div className="grid gap-4">
                {analysis.suggestions.map((s, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-xl text-sm text-slate-700 border border-slate-100">
                    {s}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Administrative Steps */}
          <div className="space-y-6">
            <Card className="p-6 sticky top-8">
               <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                <ListChecks className="w-5 h-5 text-blue-600" />
                Démarches Administratives
              </h3>
              <div className="relative space-y-6">
                <div className="absolute left-3.5 top-0 bottom-0 w-0.5 bg-slate-100" />
                {analysis.administrative_steps.map((step, i) => (
                  <div key={i} className="relative flex gap-4 pl-8">
                    <div className="absolute left-0 w-7 h-7 rounded-full bg-white border-2 border-emerald-600 flex items-center justify-center text-xs font-bold text-emerald-700 z-10">
                      {i + 1}
                    </div>
                    <p className="text-sm text-slate-600 leading-tight pt-1">{step}</p>
                  </div>
                ))}
              </div>
              <button className="w-full mt-8 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" />
                Prendre rendez-vous
              </button>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
