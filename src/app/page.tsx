"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Link from "next/link";
import Image from "next/image";
import { Plus, Briefcase, CheckCircle, Clock, BarChart3, TrendingUp, ChevronRight, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth, SignIn } from "@clerk/nextjs";

export default function Dashboard() {
  const { isLoaded, isSignedIn } = useAuth();
  const projects = useQuery(api.projects.getProjects);

  const stats = [
    { name: "Projets Totaux", value: projects?.length || 0, icon: Briefcase, color: "text-blue-600" },
    { name: "Analysés", value: projects?.filter(p => p.status === "Analysé").length || 0, icon: CheckCircle, color: "text-emerald-600" },
    { name: "En cours", value: projects?.filter(p => p.status === "Soumis").length || 0, icon: Clock, color: "text-orange-600" },
    { name: "Score Moyen", value: "82%", icon: TrendingUp, color: "text-purple-600" },
  ];

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <>
      {isSignedIn ? (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
              <p className="text-slate-500 mt-1">Bienvenue sur votre portail d'investissement CRI.</p>
            </div>
            <Link 
              href="/projets/nouveau"
              className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Créer un nouveau projet
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <Card key={stat.name} className="p-6 border-none shadow-sm bg-white hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.name}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-2xl bg-slate-50 ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
                Projets Récents
              </h2>
              <Link href="/projets" className="text-sm text-emerald-700 font-medium hover:underline">
                Voir tout
              </Link>
            </div>

            <div className="grid gap-4">
              {!projects ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-200 rounded-2xl" />)}
                </div>
              ) : projects.length === 0 ? (
                <Card className="p-12 text-center border-dashed border-2 bg-transparent">
                  <p className="text-slate-500">Aucun projet trouvé. Commencez par en créer un !</p>
                </Card>
              ) : (
                projects.slice(0, 5).map((project) => (
                  <Link key={project._id} href={`/projets/${project._id}`}>
                    <Card className="p-5 hover:border-emerald-200 transition-all group">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="font-bold text-lg group-hover:text-emerald-700 transition-colors">
                            {project.name}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span>{project.sector}</span>
                            <span>•</span>
                            <span>{project.budget.toLocaleString()} MAD</span>
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
                          <div className="text-right">
                            <p className="text-xs text-slate-400">Score</p>
                            <p className="font-bold text-emerald-600">
                              {project.status === "Analysé" ? "85/100" : "--"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-white flex flex-col lg:flex-row">
          
          {/* Left Side: Authentication */}
          <div className="lg:w-1/2 p-6 md:p-10 flex flex-col overflow-y-auto">
            {/* Logo */}
            <div className="mb-12">
              <Image src="/cri-logo.png" alt="CRI Logo" width={180} height={70} className="w-auto h-12 object-contain" />
            </div>

            <div className="max-w-md w-full mx-auto md:ml-[10%] lg:ml-[15%] flex flex-col mt-auto mb-auto">
              {/* Retour Button */}
              <button 
                onClick={() => window.location.href = 'https://www.cri-invest.ma/'}
                className="flex items-center gap-2 text-slate-500 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-full w-fit mb-8 transition-colors text-sm font-medium"
              >
                <span className="text-lg leading-none">&larr;</span> Retour
              </button>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-10">
                Plateforme<br />
                Centre Régional<br />
                d'Investissement
              </h1>

              {/* Standard Clerk Auth UI */}
              <div className="w-full max-w-md">
                <SignIn 
                  routing="hash" 
                  appearance={{
                    variables: {
                      colorPrimary: "#059669",
                      colorBackground: "transparent",
                      colorText: "#0f172a",
                    },
                    elements: {
                      rootBox: "w-full",
                      cardBox: "shadow-none",
                      card: "bg-transparent shadow-none border-0 p-0 !bg-transparent !shadow-none",
                      headerTitle: "hidden",
                      headerSubtitle: "hidden",
                      formButtonPrimary: "bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl py-3 shadow-none transition-colors",
                      formFieldInput: "rounded-xl border-slate-200 focus:ring-emerald-500 focus:border-emerald-500 py-3",
                      formFieldLabel: "text-slate-700 font-medium",
                      socialButtonsBlockButton: "rounded-xl border-slate-200 hover:bg-slate-50 py-3 transition-colors",
                      dividerLine: "bg-slate-200",
                      dividerText: "text-slate-400",
                      footerActionLink: "text-emerald-700 hover:text-emerald-800 font-medium",
                      footer: "bg-transparent border-0 px-0 pb-0",
                      developmentModeBadge: "text-emerald-600 bg-emerald-50 border border-emerald-200",
                      footerAction: "bg-transparent",
                    }
                  }}
                />
              </div>
              
            </div>
          </div>

          {/* Right Side: Information & Branding */}
          <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center relative overflow-hidden bg-emerald-900 text-white">
            <div className="absolute inset-0 bg-[url('/homepage.webp')] opacity-10 bg-cover bg-center"></div>
            <div className="relative z-10 max-w-lg mx-auto lg:mx-0 w-full">
              <h1 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
                Portail de l'Investisseur Intelligent
              </h1>
              <p className="text-emerald-50 text-lg mb-8 leading-relaxed">
                Accédez à une plateforme moderne et intuitive pour soumettre, suivre et optimiser vos projets d'investissement dans la région de Laâyoune-Sakia El Hamra.
              </p>
              
              <div className="flex items-center gap-4 text-sm text-emerald-200/60 font-medium">
                <span>© {new Date().getFullYear()} CRI Laâyoune.</span>
                <span>Tous droits réservés.</span>
              </div>
            </div>
          </div>

        </div>
      )}
    </>
  );
}
