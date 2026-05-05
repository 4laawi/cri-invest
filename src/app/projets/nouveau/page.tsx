"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Sparkles, Send, Loader2, Wand2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { analyzeProject, generateProjectDescription } from "@/app/actions/ai";

export default function NewProject() {
  const router = useRouter();
  const createProject = useMutation(api.projects.createProject);
  const saveAnalysis = useMutation(api.analysis.saveAnalysis);
  const updateStatus = useMutation(api.projects.updateProjectStatus);

  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sector: "Tourisme",
    budget: "",
    region: "Laâyoune",
  });

  const sectors = ["Tourisme", "Industrie", "Pêche", "Énergie Renouvelable", "Agriculture", "Services", "Autre"];

  const handleGenerateDescription = async () => {
    if (!formData.name) return alert("Veuillez d'abord donner un nom au projet.");
    setIsGenerating(true);
    const desc = await generateProjectDescription(formData.name);
    setFormData({ ...formData, description: desc });
    setIsGenerating(false);
  };

  const handleAutoFill = async () => {
    const idea = prompt("Décrivez votre idée en quelques mots :");
    if (!idea) return;
    setIsGenerating(true);
    // For demo, we just generate a description and a name
    const desc = await generateProjectDescription(idea);
    setFormData({ 
      ...formData, 
      name: idea.slice(0, 50), 
      description: desc 
    });
    setIsGenerating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const projectId = await createProject({
        name: formData.name,
        description: formData.description,
        sector: formData.sector,
        budget: Number(formData.budget),
        region: formData.region,
        status: "Soumis",
      });

      // Trigger AI analysis
      const analysisData = await analyzeProject(formData);
      
      await saveAnalysis({
        projectId,
        ...analysisData,
      });

      await updateStatus({ id: projectId, status: "Analysé" });

      router.push(`/projets/${projectId}`);
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue.");
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nouveau Projet</h1>
        <p className="text-slate-500 mt-1">Configurez votre dossier d'investissement avec l'aide de l'IA.</p>
      </div>

      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-4">
             <button
              type="button"
              onClick={handleAutoFill}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-semibold border border-emerald-100 hover:bg-emerald-100 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Remplir automatiquement avec IA
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nom du projet</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                placeholder="Ex: Complexe éco-touristique Plage Foum El Oued"
              />
            </div>

            <div className="relative">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-700">Description</label>
                <button
                  type="button"
                  onClick={handleGenerateDescription}
                  disabled={isGenerating}
                  className="text-xs text-emerald-700 font-semibold flex items-center gap-1 hover:underline"
                >
                  {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                  Générer avec IA
                </button>
              </div>
              <textarea
                required
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                placeholder="Décrivez votre projet en détail..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Secteur</label>
                <select
                  value={formData.sector}
                  onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                >
                  {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Budget (MAD)</label>
                <input
                  required
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  placeholder="Ex: 500000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Région</label>
              <input
                disabled
                type="text"
                value="Laâyoune-Sakia El Hamra"
                className="w-full px-4 py-2 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyse en cours par l'IA...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Soumettre et Analyser
              </>
            )}
          </button>
        </form>
      </Card>
    </div>
  );
}
