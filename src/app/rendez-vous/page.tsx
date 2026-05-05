"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Calendar, Clock, CheckCircle2, User, Briefcase } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Appointments() {
  const createAppointment = useMutation(api.other.createAppointment);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    project: "",
    date: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createAppointment(formData);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto flex items-center justify-center h-[70vh]">
        <Card className="p-12 text-center space-y-6 border-none shadow-2xl bg-white">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-900">Demande Envoyée !</h2>
            <p className="text-slate-500">Un conseiller du CRI Laâyoune vous contactera sous 24h pour confirmer votre rendez-vous.</p>
          </div>
          <button 
            onClick={() => setIsSubmitted(false)}
            className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
          >
            Nouveau rendez-vous
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Prendre Rendez-vous</h1>
        <p className="text-slate-500 mt-1">Rencontrez un expert pour concrétiser votre projet.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    Nom complet
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    placeholder="Votre nom"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    Projet concerné
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.project}
                    onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    placeholder="Ex: Complexe Solaire"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    Date souhaitée
                  </label>
                  <input
                    required
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-700 text-white rounded-xl font-bold hover:bg-emerald-800 transition-all shadow-md hover:shadow-lg"
              >
                Confirmer la demande
              </button>
            </form>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 bg-slate-900 text-white border-none">
            <h3 className="font-bold mb-4">Informations Pratiques</h3>
            <div className="space-y-4 text-sm">
              <div className="flex gap-3">
                <Clock className="w-5 h-5 text-emerald-400 shrink-0" />
                <p>Ouvert du Lundi au Vendredi<br /><span className="text-slate-400 text-xs">08:30 - 16:30</span></p>
              </div>
              <div className="flex gap-3">
                <Calendar className="w-5 h-5 text-emerald-400 shrink-0" />
                <p>Réponse garantie sous 24h ouvrables</p>
              </div>
            </div>
          </Card>

          <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
            <h3 className="font-bold text-emerald-900 text-sm mb-2">Besoin d'un rendez-vous urgent ?</h3>
            <p className="text-xs text-emerald-700 leading-relaxed">
              Vous pouvez nous appeler directement au <br />
              <span className="font-bold text-lg">+212 528 89 25 25</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
