"use client";

import { Search, Mail, Phone, MessageSquare, BookOpen, Settings, ShieldCheck, HelpCircle, ArrowRight, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";

const categories = [
  {
    title: "Gestion de Compte",
    description: "Modifiez vos informations, gérez votre mot de passe et vos préférences.",
    icon: Settings,
    color: "bg-blue-50 text-blue-600 border-blue-100",
    link: "/profile"
  },
  {
    title: "Suivi de Projets",
    description: "Tout savoir sur la soumission, l'analyse et le suivi de vos dossiers d'investissement.",
    icon: BookOpen,
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    link: "/projets"
  },
  {
    title: "Guide des Procédures",
    description: "Comment utiliser notre assistant IA pour naviguer dans les procédures administratives.",
    icon: MessageSquare,
    color: "bg-purple-50 text-purple-600 border-purple-100",
    link: "/procedures"
  },
  {
    title: "Sécurité & Confidentialité",
    description: "Informations sur la protection de vos données et la confidentialité de vos projets.",
    icon: ShieldCheck,
    color: "bg-amber-50 text-amber-600 border-amber-100",
    link: "/aide/securite"
  }
];

const contactMethods = [
  {
    name: "Email",
    value: "support@cri-invest.ma",
    icon: Mail,
    action: "Nous écrire"
  },
  {
    name: "Téléphone",
    value: "+212 5 28 89 25 25",
    icon: Phone,
    action: "Nous appeler"
  },
  {
    name: "Chat en direct",
    value: "Disponible 08h-18h",
    icon: MessageSquare,
    action: "Lancer le chat"
  }
];

export default function AidePage() {
  const [search, setSearch] = useState("");

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-12">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-[#1B4332] p-12 text-center space-y-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
        
        <div className="relative z-10 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Comment pouvons-nous vous aider ?</h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
            Trouvez des réponses rapides à vos questions ou contactez notre équipe de support dédiée à votre investissement.
          </p>
        </div>

        <div className="relative max-w-2xl mx-auto z-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-300" />
          <input
            type="text"
            placeholder="Rechercher un sujet, une procédure, une fonctionnalité..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-emerald-200/60 focus:ring-2 focus:ring-emerald-400 outline-none transition-all backdrop-blur-md"
          />
        </div>
      </div>

      {/* Quick Links / Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat, i) => (
          <Link href={cat.link} key={i}>
            <Card className="p-6 h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer border-slate-100">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 border transition-transform group-hover:scale-110 ${cat.color}`}>
                <cat.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{cat.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">{cat.description}</p>
              <div className="flex items-center text-sm font-semibold text-emerald-700 mt-auto opacity-0 group-hover:opacity-100 transition-opacity">
                En savoir plus <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Support Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Articles Populaires</h2>
          <div className="space-y-4">
            {[
              "Comment créer un dossier d'investissement ?",
              "Quelles sont les étapes de l'analyse IA ?",
              "Comment réinitialiser mon mot de passe ?",
              "Guide complet des incitations fiscales 2026",
              "Utilisation de la signature électronique"
            ].map((text, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-slate-700 font-medium">{text}</span>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Nous Contacter</h2>
          <Card className="p-6 space-y-8 border-slate-100 bg-slate-50/30">
            {contactMethods.map((method, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                  <method.icon className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{method.name}</p>
                  <p className="text-slate-900 font-bold">{method.value}</p>
                  <button className="text-sm text-emerald-700 font-medium hover:underline">{method.action}</button>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>

      {/* FAQ Banner */}
      <Card className="relative overflow-hidden p-8 border-none bg-gradient-to-r from-emerald-800 to-emerald-950 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
        <div className="relative z-10 space-y-2 text-center md:text-left">
          <h2 className="text-2xl font-bold">Besoin de réponses rapides ?</h2>
          <p className="text-emerald-100/80">Consultez notre base de connaissances interactive pour des réponses immédiates.</p>
        </div>
        <Link 
          href="/faq"
          className="relative z-10 px-8 py-4 bg-white text-emerald-900 rounded-2xl font-bold hover:bg-emerald-50 transition-all shadow-xl flex items-center gap-2 group"
        >
          Voir la FAQ <HelpCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        </Link>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 transform translate-x-1/2"></div>
      </Card>
    </div>
  );
}
