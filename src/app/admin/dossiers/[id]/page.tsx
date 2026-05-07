"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Briefcase, 
  User as UserIcon, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  TrendingUp,
  ShieldAlert,
  ListChecks,
  Lightbulb,
  Loader2,
  BadgeInfo,
  DollarSign,
  Users
} from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function AdminDossierDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [projectUser, setProjectUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const projectId = params.id as string;

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
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();

        if (projectError) throw projectError;
        setProject(projectData);

        if (projectData.user_id) {
          const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', projectData.user_id)
            .single();
          if (!userError) setProjectUser(userData);
        }

        const { data: analysisData } = await supabase
          .from('analysis')
          .select('*')
          .eq('project_id', projectId)
          .single();
        
        if (analysisData) setAnalysis(analysisData);

      } catch (err: any) {
        console.error("Error fetching project details:", err);
        setError(err.message || "Erreur lors du chargement des détails.");
      } finally {
        setIsLoading(false);
      }
    }

    if (user && projectId) fetchData();
  }, [user, projectId]);

  const handleUpdateStatus = async (newStatus: string, reason?: string) => {
    setIsUpdating(true);
    try {
      const updateData: any = { status: newStatus };
      if (reason) updateData.rejection_reason = reason;
      else if (newStatus !== "Rejeté") updateData.rejection_reason = null;

      const { error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', projectId);

      if (error) throw error;
      setProject({ ...project, ...updateData });
      setIsRejecting(false);
      setRejectionReason("");
    } catch (err: any) {
      alert(`Erreur: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900">Erreur</h2>
        <p className="text-slate-500">{error || "Projet non trouvé."}</p>
        <Link href="/admin/dossiers" className="mt-4 inline-flex items-center gap-2 text-emerald-600 font-bold hover:underline">
          <ArrowLeft className="w-4 h-4" /> Retour à la liste
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <Link href="/admin/dossiers" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Retour à la gestion des dossiers
        </Link>
        <div className="flex gap-2">
          {project.status === "En attente" && (
            <button 
              disabled={isUpdating}
              onClick={() => handleUpdateStatus("En cours de traitement")}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
            >
              {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Clock className="w-4 h-4" />}
              Commencer le traitement
            </button>
          )}
          
          {(project.status === "En attente" || project.status === "En cours de traitement") && (
            <>
              <button 
                disabled={isUpdating}
                onClick={() => handleUpdateStatus("Validé")}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center gap-2"
              >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Valider
              </button>
              <button 
                disabled={isUpdating}
                onClick={() => setIsRejecting(!isRejecting)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${isRejecting ? 'bg-slate-900 text-white' : 'bg-white border border-red-200 text-red-600 hover:bg-red-50'}`}
              >
                <AlertCircle className="w-4 h-4" />
                {isRejecting ? 'Annuler' : 'Rejeter'}
              </button>
            </>
          )}

          {project.status === "Validé" && (
            <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-bold flex items-center gap-2 border border-emerald-100">
              <CheckCircle2 className="w-4 h-4" />
              Dossier Validé
            </div>
          )}

          {project.status === "Rejeté" && (
            <div className="px-4 py-2 bg-red-50 text-red-700 rounded-xl text-sm font-bold flex items-center gap-2 border border-red-100">
              <AlertCircle className="w-4 h-4" />
              Dossier Rejeté
            </div>
          )}
        </div>
      </div>

      {isRejecting && (
        <Card className="p-6 border-red-100 bg-red-50/30 animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="text-sm font-bold text-red-900 mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Motif du rejet
          </h3>
          <textarea 
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Expliquez à l'investisseur pourquoi son dossier a été rejeté..."
            className="w-full p-4 rounded-xl border border-red-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 bg-white text-sm min-h-[100px]"
          />
          <div className="flex justify-end mt-4">
            <button 
              disabled={!rejectionReason.trim() || isUpdating}
              onClick={() => handleUpdateStatus("Rejeté", rejectionReason)}
              className="px-6 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-all disabled:opacity-50"
            >
              {isUpdating ? 'Mise à jour...' : 'Confirmer le rejet'}
            </button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Project Details & Analysis */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-8 border-none shadow-sm bg-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 opacity-50" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">{project.name}</h1>
                  <Badge 
                    variant={
                      project.status === "Validé" ? "success" : 
                      project.status === "En cours de traitement" ? "info" : 
                      project.status === "En attente" ? "warning" : 
                      project.status === "Rejeté" ? "destructive" : "default"
                    }
                    className="mt-1"
                  >
                    {project.status === "En attente" ? "En attente de revue" : project.status}
                  </Badge>
                </div>
              </div>
              
              <div className="prose prose-slate max-w-none">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Description du Projet</h3>
                <div className="text-slate-600 leading-relaxed bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.description}</ReactMarkdown>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="p-4 rounded-2xl border border-slate-100 bg-white">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Secteur & Localisation</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-700">
                      <BadgeInfo className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm font-medium">{project.sector}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <MapPin className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm font-medium">{project.commune}, {project.province}, {project.region}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-2xl border border-slate-100 bg-white">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Chiffres Clés</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-700">
                      <DollarSign className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm font-bold">{project.budget?.toLocaleString()} MAD</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <Users className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm font-bold">{project.estimated_jobs} emplois prévus</span>
                    </div>
                    {project.is_listed && (
                      <div className="flex items-center gap-2 text-amber-600">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase">Projet Stratégique (Listé)</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {analysis ? (
            <div className="space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-none shadow-lg shadow-emerald-200">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-5 h-5 text-emerald-200" />
                    <h3 className="font-bold">Score de Viabilité</h3>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-5xl font-bold">{analysis.score}</span>
                    <span className="text-emerald-200 mb-2 font-medium">/ 100</span>
                  </div>
                  <p className="text-emerald-100 text-sm mt-4">Calculé par l'IA basé sur les critères régionaux.</p>
                </Card>

                <Card className="p-6 border-none shadow-sm bg-white">
                  <div className="flex items-center gap-3 mb-4">
                    <ShieldAlert className="w-5 h-5 text-orange-500" />
                    <h3 className="font-bold text-slate-900">Niveau de Risque</h3>
                  </div>
                  <Badge variant="warning" className="text-lg px-4 py-1 rounded-xl mb-4">
                    {analysis.risk_level}
                  </Badge>
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <Clock className="w-4 h-4" />
                    Délai estimé: <span className="font-bold text-slate-900">{analysis.estimated_timeline}</span>
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 border-none shadow-sm bg-white">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    Points Forts
                  </h3>
                  <ul className="space-y-3">
                    {analysis.strengths?.map((s: string, i: number) => (
                      <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card className="p-6 border-none shadow-sm bg-white">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                    Défis à Relever
                  </h3>
                  <ul className="space-y-3">
                    {analysis.weaknesses?.map((w: string, i: number) => (
                      <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>

              <Card className="p-6 border-none shadow-sm bg-white">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <ListChecks className="w-5 h-5 text-blue-600" />
                  Démarches Administratives Identifiées
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysis.administrative_steps?.map((step: string, i: number) => (
                    <div key={i} className="p-4 bg-slate-50 rounded-xl text-sm text-slate-700 border border-slate-100 flex gap-3">
                      <span className="font-bold text-blue-600">{i+1}.</span>
                      {step}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          ) : (
             <Card className="p-12 text-center bg-slate-50 border-dashed border-2 border-slate-200">
                <Loader2 className="w-10 h-10 text-slate-300 animate-spin mx-auto mb-4" />
                <p className="text-slate-500 font-medium">L'analyse IA n'est pas encore disponible pour ce projet.</p>
             </Card>
          )}
        </div>

        {/* Right Column: Investor Info & History */}
        <div className="space-y-8">
          <Card className="p-6 border-none shadow-sm bg-white">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-emerald-600" />
              Informations de l'Investisseur
            </h3>
            
            {projectUser ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-xl font-bold">
                    {projectUser.first_name?.[0]}{projectUser.last_name?.[0]}
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900">{projectUser.first_name} {projectUser.last_name}</p>
                    <p className="text-sm text-slate-500">{projectUser.email}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-50 space-y-4">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Type d'investisseur</p>
                    <p className="text-sm font-medium text-slate-700">{project.investor_type || projectUser.investor_type || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Forme Juridique</p>
                    <p className="text-sm font-medium text-slate-700">{project.legal_form || "N/A"}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Nationalité</p>
                      <p className="text-sm font-medium text-slate-700">{project.nationality || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">CIN / Passeport</p>
                      <p className="text-sm font-medium text-slate-700">{project.cin || "N/A"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Adresse Complète</p>
                    <p className="text-sm font-medium text-slate-700">{project.address || "N/A"}</p>
                    {project.zip_code && <p className="text-sm text-slate-500 mt-1">{project.zip_code} {project.country}</p>}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic">Informations profil non disponibles.</p>
            )}
          </Card>

          <Card className="p-6 border-none shadow-sm bg-white">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              Historique & Délais
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Créé le</span>
                <span className="font-medium text-slate-900">{new Date(project.created_at).toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Dernière mise à jour</span>
                <span className="font-medium text-slate-900">{new Date(project.updated_at || project.created_at).toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="pt-4 border-t border-slate-50">
                <button className="w-full py-3 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Planifier un entretien
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
