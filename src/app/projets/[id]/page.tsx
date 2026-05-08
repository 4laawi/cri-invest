"use client";

import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ArrowLeft, 
  TrendingUp, 
  ListChecks, 
  Lightbulb,
  ShieldAlert,
  Calendar,
  Loader2,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ProjectDetail() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(true);

  const projectId = params.id as string;

  useEffect(() => {
    async function fetchData() {
      if (!user || !projectId) return;
      
      const { data: projectData } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();
      
      const { data: analysisData } = await supabase
        .from('analysis')
        .select('*')
        .eq('project_id', projectId)
        .single();

      if (projectData) setProject(projectData);
      if (analysisData) setAnalysis(analysisData);
      setIsFetching(false);
    }

    if (!authLoading) {
      if (user) fetchData();
      else setIsFetching(false);
    }
  }, [user, authLoading, projectId]);

  if (authLoading || isFetching || !project) return (
    <div className="flex flex-col items-center justify-center h-96 gap-4">
      <Loader2 className="w-8 h-8 animate-spin text-emerald-700" />
      <p className="text-slate-500 text-sm animate-pulse">Chargement du projet...</p>
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
                project.status === "Validé" ? "success" : 
                project.status === "En cours de traitement" ? "info" : 
                project.status === "En attente" ? "warning" : 
                project.status === "Rejeté" ? "destructive" : "default"
              }
              className="text-sm px-3 py-1"
            >
              {project.status === "Brouillon" ? "Brouillon" : 
               project.status === "En attente" ? "En attente de revue" : 
               project.status}
            </Badge>
          </div>
          <div className="text-slate-500 max-w-2xl prose prose-slate prose-sm">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.description}</ReactMarkdown>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400 font-medium">Investissement estimé</p>
          <p className="text-2xl font-bold text-slate-900">{project.budget.toLocaleString()} MAD</p>
        </div>
      </div>

      {project.status === "En attente" && (
        <Card className="p-12 text-center bg-amber-50 border-amber-100">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
              <Clock className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-amber-900 mb-2">Dossier en attente de revue</h3>
              <p className="text-amber-700 max-w-md mx-auto">
                Votre dossier a été bien reçu et est en attente d'être examiné par un conseiller CRI. Vous recevrez une notification dès que l'état changera.
              </p>
            </div>
          </div>
        </Card>
      )}

      {project.status === "En cours de traitement" && (
        <Card className="p-12 text-center bg-blue-50 border-blue-100">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 animate-pulse">
              <Clock className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Dossier en cours de traitement</h3>
              <p className="text-blue-700 max-w-md mx-auto">
                Un conseiller examine actuellement votre demande. Nous vérifions la conformité de vos documents et la viabilité de votre projet.
              </p>
            </div>
          </div>
        </Card>
      )}

      {project.status === "Rejeté" && (
        <Card className="p-12 bg-red-50 border-red-100">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 shrink-0">
              <AlertCircle className="w-10 h-10" />
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-red-900 mb-2">Dossier non validé</h3>
                <p className="text-red-700 font-medium">
                  Après examen de votre dossier, nous ne pouvons pas procéder à sa validation en l'état.
                </p>
              </div>
              <div className="p-6 bg-white rounded-2xl border border-red-100 shadow-sm">
                <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2">Motif du rejet :</p>
                <p className="text-slate-800 leading-relaxed italic">"{project.rejection_reason || "Aucun motif spécifié."}"</p>
              </div>
              <Link 
                href={`/projets/nouveau?id=${project.id}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200"
              >
                Corriger mon dossier
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </Card>
      )}

      {project.status === "Brouillon" && (
        <Card className="p-12 text-center bg-orange-50 border-orange-100">
          <div className="flex flex-col items-center gap-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="max-w-md">
              <h3 className="text-xl font-bold text-orange-900 mb-2">Dossier en attente de finalisation</h3>
              <p className="text-orange-700 mb-8">
                Ce projet est actuellement enregistré comme brouillon. Vous devez compléter toutes les informations et soumettre le dossier pour bénéficier de l'analyse stratégique.
              </p>
              <Link 
                href={`/projets/nouveau?id=${project.id}`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-all shadow-lg hover:shadow-orange-200"
              >
                Finaliser mon dossier
                <ChevronRight className="w-5 h-5" />
              </Link>
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
                  {analysis.strengths.map((s: string, i: number) => (
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
                  {analysis.weaknesses.map((w: string, i: number) => (
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
                {analysis.suggestions.map((s: string, i: number) => (
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
                {analysis.administrative_steps.map((step: string, i: number) => (
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
