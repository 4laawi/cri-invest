"use client";

import { useState } from "react";
import { Search, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

const defaultFaqs = [
  {
    question: "Quels sont les avantages fiscaux pour investir à Laâyoune ?",
    answer: "Les investisseurs bénéficient de nombreuses exonérations, notamment sur l'impôt sur les sociétés (IS) pendant les 5 premières années, l'exonération de la TVA sur les biens d'équipement, et des droits d'importation réduits."
  },
  {
    question: "Comment le CRI accompagne-t-il les nouveaux projets ?",
    answer: "Le CRI offre un guichet unique pour toutes les procédures administratives, de la création d'entreprise à l'octroi des autorisations d'urbanisme, en passant par l'assistance technique et la recherche de foncier."
  },
  {
    question: "Quels sont les secteurs prioritaires dans la région ?",
    answer: "La région de Laâyoune-Sakia El Hamra mise sur les énergies renouvelables (solaire et éolien), la pêche maritime, le tourisme durable et l'agriculture de précision."
  },
  {
    question: "Comment obtenir un terrain industriel ?",
    answer: "L'accès au foncier industriel se fait via les zones d'activités économiques de la région. Le CRI vous assiste dans le montage du dossier pour l'acquisition ou la location de lots aménagés."
  }
];

export default function FAQ() {
  const [faqs, setFaqs] = useState<any[]>(defaultFaqs);
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    async function fetchFaqs() {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data && data.length > 0) {
        setFaqs(data);
      }
    }
    fetchFaqs();
  }, []);

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(search.toLowerCase()) ||
    faq.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">Questions Fréquentes</h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          Tout ce que vous devez savoir pour réussir votre investissement dans la région de Laâyoune.
        </p>
      </div>

      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Rechercher une question..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-sm"
        />
      </div>

      <div className="space-y-4">
        {filteredFaqs.map((faq, i) => (
          <Card 
            key={i} 
            className={cn(
              "overflow-hidden transition-all duration-300",
              openIndex === i ? "border-emerald-200 shadow-md" : "hover:border-slate-300"
            )}
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between p-6 text-left"
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                  openIndex === i ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-500"
                )}>
                  <HelpCircle className="w-5 h-5" />
                </div>
                <span className="font-bold text-slate-800">{faq.question}</span>
              </div>
              {openIndex === i ? <ChevronUp className="w-5 h-5 text-emerald-700" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </button>
            {openIndex === i && (
              <div className="px-6 pb-6 pl-18">
                <p className="text-slate-600 leading-relaxed pl-12 border-l-2 border-emerald-100 ml-4">
                  {faq.answer}
                </p>
              </div>
            )}
          </Card>
        ))}
      </div>

      <Card className="p-8 bg-emerald-700 text-white text-center space-y-6 mt-12 border-none">
        <h2 className="text-2xl font-bold">Vous ne trouvez pas de réponse ?</h2>
        <p className="text-emerald-100 max-w-lg mx-auto">
          Nos conseillers sont disponibles pour répondre à toutes vos questions spécifiques.
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-white text-emerald-700 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-all">
            Nous contacter
          </button>
          <button className="bg-emerald-600 text-white border border-emerald-500 px-6 py-3 rounded-xl font-bold hover:bg-emerald-500 transition-all">
            Poser une question à l'IA
          </button>
        </div>
      </Card>
    </div>
  );
}
