"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { 
  Sparkles, 
  Send, 
  Loader2, 
  Wand2,
  ChevronDown
} from "lucide-react";
import { analyzeProject, generateProjectDescription } from "@/app/actions/ai";

// Custom Underline Components
const UnderlineInput = ({ label, value, onChange, placeholder, type = "text", suffix, required = false }: any) => (
  <div className="relative w-full group">
    <label className="block text-[11px] font-medium text-slate-500 mb-0.5 group-focus-within:text-[#1B4332] transition-colors">
      {label}
    </label>
    <div className="relative flex items-center">
      <input
        required={required}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent border-b border-slate-300 py-1.5 focus:outline-none focus:border-[#1B4332] transition-all text-slate-800 font-semibold text-lg placeholder:text-slate-300 placeholder:font-normal"
      />
      {suffix && <span className="absolute right-0 bottom-2 text-sm font-bold text-[#1B4332]/60">{suffix}</span>}
    </div>
  </div>
);

const UnderlineSelect = ({ label, value, onChange, options, required = false }: any) => (
  <div className="relative w-full group">
    <label className="block text-[11px] font-medium text-slate-500 mb-0.5 group-focus-within:text-[#1B4332] transition-colors">
      {label}
    </label>
    <div className="relative">
      <select
        required={required}
        value={value}
        onChange={onChange}
        className={`w-full bg-transparent border-b border-slate-300 py-1.5 focus:outline-none focus:border-[#1B4332] transition-all font-semibold text-lg appearance-none cursor-pointer ${!value ? 'text-slate-300' : 'text-slate-800'}`}
      >
        <option value="" disabled hidden>{label}</option>
        {options.map((opt: any) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <div className="absolute right-0 bottom-2.5 pointer-events-none text-slate-500">
        <ChevronDown className="w-4 h-4" />
      </div>
    </div>
  </div>
);

export default function NewProject() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#1B4332]" />
        <p className="text-slate-500 font-medium animate-pulse">Chargement...</p>
      </div>
    }>
      <NewProjectContent />
    </Suspense>
  );
}

function NewProjectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const { user, isLoading: authLoading } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#1B4332]" />
        <p className="text-slate-500 font-medium animate-pulse">Vérification de l'accès...</p>
      </div>
    );
  }

  const [isGenerating, setIsGenerating] = useState(false);
  
  // Expanded form data to match screenshot
  const [formData, setFormData] = useState({
    // Section 1: Investor Info
    investorType: "",
    legalForm: "",
    civility: "",
    firstName: "",
    lastName: "",
    nationality: "",
    address: "",
    country: "",
    zipCode: "",
    cin: "",

    // Section 2: Project Details
    name: "", // Intitulé du projet
    region: "",
    province: "",
    commune: "",
    sector: "", // Branche d'activité
    budget: "", // Montant total d'investissement
    estimatedJobs: "", // Nombre d'emplois prévus
    isListed: "", // Votre projet fait-il partie de cette liste?
    description: "", // Description du projet
    
    // Hidden/Legacy fields for backend compatibility
    investmentType: "Création",
    surfaceArea: "0",
    timeline: "12",
  });

  useEffect(() => {
    async function loadProject() {
      if (!editId || !user) return;
      setIsLoading(true);
      setLoadingMessage("Chargement de votre brouillon...");
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', editId)
        .single();
      
      if (error) {
        console.error("Error loading project:", error);
      } else if (data) {
        setFormData({
          ...formData,
          name: data.name || "",
          description: data.description || "",
          sector: data.sector || "Autre",
          investmentType: data.investment_type || "Création",
          legalForm: data.legal_form || "Indéterminée",
          budget: data.budget?.toString() || "",
          region: data.region || "Laâyoune-Sakia El Hamra",
          province: data.province || "",
          estimatedJobs: data.estimated_jobs?.toString() || "",
          surfaceArea: data.surface_area?.toString() || "0",
          timeline: data.timeline?.toString() || "12",
        });
      }
      setIsLoading(false);
    }
    if (!authLoading && user && editId) {
      loadProject();
    }
  }, [editId, user, authLoading]);

  const sectors = ["Tourisme", "Industrie", "Pêche", "Énergie Renouvelable", "Agriculture", "Services", "Autre"];
  const investorTypes = ["Auto-entrepreneur", "Personne Physique", "Société"];
  const legalForms = ["Auto-entrepreneur", "SARL", "SARL AU", "SA", "SNC", "Coopérative", "Personne Physique"];
  const civilities = ["M.", "Mme", "Mlle"];
  const countries = ["Maroc", "France", "Espagne", "USA", "Autre"];
  const provinces = ["Laâyoune", "Tarfaya", "Boujdour", "Es-Semara"];
  const communes = ["Laâyoune", "El Marsa", "Foum El Oued", "Boujdour"];
  const yesNoOptions = ["Non", "Oui"];

  const handleGenerateDescription = async () => {
    if (!formData.name) return alert("Veuillez d'abord donner un nom au projet.");
    setIsGenerating(true);
    try {
      const context = `Nom: ${formData.name}, Secteur: ${formData.sector}, Budget: ${formData.budget} DH, Province: ${formData.province}`;
      const desc = await generateProjectDescription(context);
      // Strip markdown stars for textarea display
      const cleanDesc = desc.replace(/\*\*/g, '');
      setFormData({ ...formData, description: cleanDesc });
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };


  const handleTestFill = () => {
    setFormData({
      investorType: "Société",
      legalForm: "SARL",
      civility: "M.",
      firstName: "Test",
      lastName: "Utilisateur",
      nationality: "MAROCAINE",
      address: "123 Rue de l'Innovation, Casablanca",
      country: "Maroc",
      zipCode: "20000",
      cin: "AB123456",
      name: "Projet de Test Solaire",
      region: "Laâyoune-Sakia El Hamra",
      province: "Laâyoune",
      commune: "Laâyoune",
      sector: "Énergie Renouvelable",
      budget: "5000000",
      estimatedJobs: "25",
      isListed: "Non",
      description: "Ceci est une description de test pour un projet d'énergie solaire photovoltaïque visant à alimenter les zones rurales. Le projet comprend l'installation de panneaux solaires de haute efficacité et un système de stockage par batterie.",
      investmentType: "Création",
      surfaceArea: "1000",
      timeline: "18",
    });
  };

  const parseNumber = (val: string | number) => {
    if (typeof val === 'number') return val;
    const cleaned = val.replace(/\s/g, '').replace(/,/g, '.');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  const [loadingMessage, setLoadingMessage] = useState("Soumission du dossier...");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("Vous devez être connecté.");
    
    setIsLoading(true);
    setLoadingMessage("Initialisation...");
    
    try {
      const projectData = {
        user_id: user.id,
        name: formData.name || "Nouveau Projet",
        description: formData.description || "",
        sector: formData.sector || "Autre",
        investment_type: formData.investmentType || "Création",
        legal_form: formData.legalForm || "Indéterminée",
        budget: parseNumber(formData.budget),
        region: formData.region || "Laâyoune-Sakia El Hamra",
        province: formData.province || "",
        estimated_jobs: parseNumber(formData.estimatedJobs),
        surface_area: parseNumber(formData.surfaceArea),
        timeline: parseNumber(formData.timeline),
        status: "En attente",
        // New fields for admin view
        investor_type: formData.investorType,
        civility: formData.civility,
        first_name: formData.firstName,
        last_name: formData.lastName,
        nationality: formData.nationality,
        address: formData.address,
        country: formData.country,
        zip_code: formData.zipCode,
        cin: formData.cin,
        commune: formData.commune,
        is_listed: formData.isListed === "Oui",
      };

      setLoadingMessage("Enregistrement du projet dans la base de données...");
      
      let projectId = editId;
      
      if (editId) {
        const { error: updateError } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', editId);
        if (updateError) throw updateError;
      } else {
        const { data: project, error: projectError } = await supabase
          .from('projects')
          .insert([projectData])
          .select()
          .single();
        
        if (projectError) throw projectError;
        if (!project) throw new Error("Le projet n'a pas pu être créé.");
        projectId = project.id;
      }

      console.log("Project created with ID:", projectId);
      setLoadingMessage("Analyse du projet par l'IA (cela peut prendre quelques secondes)...");
      
      const analysisData = await analyzeProject(formData);
      console.log("Analysis received:", analysisData);
      
      setLoadingMessage("Enregistrement de l'analyse...");
      const { error: analysisError } = await supabase
        .from('analysis')
        .insert([{
          user_id: user.id,
          project_id: projectId,
          score: analysisData.score,
          strengths: analysisData.strengths,
          weaknesses: analysisData.weaknesses,
          administrative_steps: analysisData.administrative_steps,
          suggestions: analysisData.suggestions,
          estimated_timeline: analysisData.estimated_timeline,
          risk_level: analysisData.risk_level,
        }]);

      if (analysisError) throw analysisError;

      const { error: statusError } = await supabase
        .from('projects')
        .update({ status: "En attente" })
        .eq('id', projectId);

      if (statusError) throw statusError;
      
      setLoadingMessage("Succès ! Redirection...");
      router.push("/projets");

    } catch (error: any) {
      console.error("Critical submission error:", error);
      alert(`Erreur lors de la soumission : ${error.message || "Une erreur inconnue est survenue."}`);
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!user) return alert("Vous devez être connecté.");
    if (!formData.name) return alert("Veuillez au moins donner un nom à votre projet pour l'enregistrer en brouillon.");

    setIsLoading(true);
    setLoadingMessage("Enregistrement du brouillon...");

    try {
      const projectData = {
        user_id: user.id,
        name: formData.name,
        description: formData.description || "",
        sector: formData.sector || "Autre",
        investment_type: formData.investmentType || "Création",
        legal_form: formData.legalForm || "Indéterminée",
        budget: parseNumber(formData.budget),
        region: formData.region || "Laâyoune-Sakia El Hamra",
        province: formData.province || "",
        estimated_jobs: parseNumber(formData.estimatedJobs),
        surface_area: parseNumber(formData.surfaceArea),
        timeline: parseNumber(formData.timeline),
        status: "Brouillon",
        // New fields
        investor_type: formData.investorType,
        civility: formData.civility,
        first_name: formData.firstName,
        last_name: formData.lastName,
        nationality: formData.nationality,
        address: formData.address,
        country: formData.country,
        zip_code: formData.zipCode,
        cin: formData.cin,
        commune: formData.commune,
        is_listed: formData.isListed === "Oui",
      };

      if (editId) {
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', editId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([projectData]);
        if (error) throw error;
      }

      router.push("/projets");
    } catch (error: any) {
      console.error("Draft saving error:", error);
      alert(`Erreur lors de l'enregistrement : ${error.message}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header Section */}
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <h1 className="text-[2.5rem] font-bold text-[#1B4332] mb-4">Informations générales sur votre projet</h1>
        <p className="text-slate-500 leading-relaxed text-sm">
          Merci de bien vouloir renseigner les informations relatives à votre projet, ce formulaire nous permettra de cadrer et d'évaluer vos besoins en matière de procédures et autorisations. Vous pouvez toujours vous rendre sur la page <span className="text-blue-500 cursor-pointer hover:underline">Procédures et Incitation</span> pour plus de détails.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-20">
        
        {/* Magic Fill Buttons */}
        <div className="flex justify-end gap-3 -mb-12">
          <button
            type="button"
            onClick={handleTestFill}
            className="flex items-center gap-2 py-2 px-4 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100 hover:bg-blue-100 transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Test Fill
          </button>
        </div>

        {/* Section 1: Informations Générales */}
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-10 gap-x-12">
            <div className="md:col-start-2 md:col-span-1">
               <UnderlineSelect 
                label="L'investisseur est une" 
                value={formData.investorType}
                onChange={(e: any) => setFormData({...formData, investorType: e.target.value})}
                options={investorTypes}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 md:col-span-3 gap-10">
              <UnderlineSelect 
                label="Forme Juridique" 
                value={formData.legalForm}
                onChange={(e: any) => setFormData({...formData, legalForm: e.target.value})}
                options={legalForms}
              />
              <UnderlineSelect 
                label="Civilité" 
                value={formData.civility}
                onChange={(e: any) => setFormData({...formData, civility: e.target.value})}
                options={civilities}
              />
              <UnderlineInput 
                label="Prénom" 
                value={formData.firstName}
                onChange={(e: any) => setFormData({...formData, firstName: e.target.value})}
                placeholder="Ex: Ali"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 md:col-span-3 gap-10">
              <UnderlineInput 
                label="Nom de famille" 
                value={formData.lastName}
                onChange={(e: any) => setFormData({...formData, lastName: e.target.value})}
                placeholder="Ex: Taghi"
              />
              <UnderlineSelect 
                label="Nationalité" 
                value={formData.nationality}
                onChange={(e: any) => setFormData({...formData, nationality: e.target.value})}
                options={["MAROCAINE", "ETRANGERE"]}
              />
              <UnderlineInput 
                label="Adresse" 
                value={formData.address}
                onChange={(e: any) => setFormData({...formData, address: e.target.value})}
                placeholder="Ex: Av mohamed abderrahmane nr 06"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 md:col-span-3 gap-10">
              <UnderlineSelect 
                label="Pays" 
                value={formData.country}
                onChange={(e: any) => setFormData({...formData, country: e.target.value})}
                options={countries}
              />
              <UnderlineInput 
                label="Code Postal" 
                value={formData.zipCode}
                onChange={(e: any) => setFormData({...formData, zipCode: e.target.value})}
                placeholder="70000"
              />
              <UnderlineInput 
                label="CIN" 
                value={formData.cin}
                onChange={(e: any) => setFormData({...formData, cin: e.target.value})}
                placeholder="Ex: SJ4067"
              />
            </div>
          </div>
        </div>

        {/* Section Header 2 */}
        <div className="text-center">
          <h2 className="text-[2rem] font-bold text-[#1B4332]">Détails de votre projet</h2>
        </div>

        {/* Section 2: Détails du projet */}
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-10 gap-x-12">
            <div className="md:col-span-1">
              <UnderlineInput 
                label="Intitulé du projet" 
                value={formData.name}
                onChange={(e: any) => setFormData({...formData, name: e.target.value})}
                placeholder="Ex: Hôtel Touristique"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 md:col-span-3 gap-10">
              <UnderlineSelect 
                label="Région" 
                value={formData.region}
                onChange={(e: any) => setFormData({...formData, region: e.target.value})}
                options={["Laâyoune-Sakia El Hamra"]}
              />
              <UnderlineSelect 
                label="Préfecture / Province" 
                value={formData.province}
                onChange={(e: any) => setFormData({...formData, province: e.target.value})}
                options={provinces}
              />
              <UnderlineSelect 
                label="Commune" 
                value={formData.commune}
                onChange={(e: any) => setFormData({...formData, commune: e.target.value})}
                options={communes}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 md:col-span-3 gap-10">
              <UnderlineSelect 
                label="Branche d'activité" 
                value={formData.sector}
                onChange={(e: any) => setFormData({...formData, sector: e.target.value})}
                options={sectors}
              />
              <div className="hidden md:block"></div>
              <div className="hidden md:block"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 md:col-span-3 gap-10">
              <UnderlineInput 
                label="Montant total d'investissement" 
                value={formData.budget}
                onChange={(e: any) => setFormData({...formData, budget: e.target.value})}
                placeholder="Ex: 30 000 000"
                suffix="DH"
                required
              />
              <UnderlineInput 
                label="Nombre d'emplois prévus" 
                value={formData.estimatedJobs}
                onChange={(e: any) => setFormData({...formData, estimatedJobs: e.target.value})}
                placeholder="Ex: 10"
                required
              />
              <UnderlineSelect 
                label="Votre projet fait-il partie de cette liste?" 
                value={formData.isListed}
                onChange={(e: any) => setFormData({...formData, isListed: e.target.value})}
                options={yesNoOptions}
              />
            </div>
          </div>

          {/* Description Block */}
          <div className="mt-16 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-[#1B4332] font-bold text-xl">Description du projet <span className="text-slate-400 font-normal text-sm ml-2">500 caractères maximum.</span></h3>
              <button
                type="button"
                onClick={handleGenerateDescription}
                disabled={isGenerating}
                className="text-xs text-[#1B4332] font-bold flex items-center gap-1.5 hover:bg-emerald-50 px-3 py-1.5 rounded-full transition-colors border border-emerald-100"
              >
                {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                Améliorer avec l'IA
              </button>
            </div>
            <textarea
              required
              rows={6}
              maxLength={500}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-6 rounded-none border border-slate-200 focus:outline-none focus:border-[#1B4332] transition-all text-slate-700 bg-white placeholder:text-slate-300 resize-none shadow-sm"
              placeholder="Décrivez les objectifs, les services/produits, et l'impact de votre projet..."
            />
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="pt-12 flex flex-col md:flex-row gap-4">
          <button
            disabled={isLoading}
            type="button"
            onClick={handleSaveDraft}
            className="flex-1 flex items-center justify-center gap-3 py-5 bg-white text-[#1B4332] border-2 border-[#1B4332] rounded-full font-bold hover:bg-emerald-50 transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {isLoading && loadingMessage.includes("brouillon") ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin text-[#1B4332]" />
                <span className="animate-pulse">Enregistrement...</span>
              </>
            ) : (
              <>
                Enregistrer en Brouillon
              </>
            )}
          </button>
          
          <button
            disabled={isLoading}
            type="submit"
            className="flex-[2] flex items-center justify-center gap-3 py-5 bg-[#1B4332] text-white rounded-full font-bold hover:bg-[#143226] transition-all shadow-xl hover:shadow-[#1B4332]/20 disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {isLoading && !loadingMessage.includes("brouillon") ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
                <span className="animate-pulse">{loadingMessage}</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                Soumettre le Dossier et Lancer l'Analyse
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

