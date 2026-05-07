"use client";

import { ShieldCheck, Lock, Eye, FileCheck, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function SecurityPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <Link href="/aide" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-emerald-700 transition-colors gap-2">
        <ArrowLeft className="w-4 h-4" /> Retour au Centre d'Aide
      </Link>

      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">Sécurité & Confidentialité</h1>
        <p className="text-lg text-slate-500">
          La protection de vos données et de vos projets d'investissement est notre priorité absolue.
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="p-8 space-y-4 border-slate-100 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Protection des Données</h2>
          <p className="text-slate-600 leading-relaxed">
            Toutes les informations que vous soumettez sur le Portail de l'Investisseur sont cryptées selon les standards de l'industrie (AES-256). Nous utilisons des protocoles de sécurité avancés pour garantir que seuls les interlocuteurs autorisés du CRI peuvent accéder à vos dossiers.
          </p>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 space-y-3 border-slate-100 shadow-sm">
            <Lock className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900">Accès Sécurisé</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Authentification sécurisée avec gestion de session et protection contre les accès non autorisés.
            </p>
          </Card>
          <Card className="p-6 space-y-3 border-slate-100 shadow-sm">
            <Eye className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-slate-900">Confidentialité Totale</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Vos projets d'investissement sont traités avec la plus grande discrétion par nos conseillers spécialisés.
            </p>
          </Card>
        </div>

        <Card className="p-8 bg-slate-900 text-white space-y-6">
          <div className="flex items-center gap-4">
            <FileCheck className="w-8 h-8 text-emerald-400" />
            <h2 className="text-2xl font-bold">Conformité CNDP</h2>
          </div>
          <p className="text-slate-300 leading-relaxed">
            Notre plateforme est conforme à la loi 09-08 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel. Vous disposez d'un droit d'accès, de rectification et d'opposition au traitement de vos données.
          </p>
          <button className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-all">
            Consulter la Charte de Confidentialité
          </button>
        </Card>
      </div>
    </div>
  );
}
