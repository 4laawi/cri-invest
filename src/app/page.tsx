"use client";

import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import Link from "next/link";
import Image from "next/image";
import { 
  Plus, 
  Search, 
  Bell, 
  Mail, 
  ArrowUpRight, 
  Loader2, 
  Video, 
  MoreHorizontal,
  Pause,
  Play,
  Square,
  ChevronRight,
  TrendingUp,
  Briefcase
} from "lucide-react";
import { useEffect, useState, useRef } from "react";

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const [projects, setProjects] = useState<any[] | undefined>(undefined);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isFetchingProjects, setIsFetchingProjects] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [animatePatterned, setAnimatePatterned] = useState(false);
  const [animateGreen, setAnimateGreen] = useState(false);
  const [displayPercent, setDisplayPercent] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(5048); // 01:24:08 = 5048 seconds
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    async function fetchProjects() {
      if (!user) return;
      setIsFetchingProjects(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error) setProjects(data);
      setIsFetchingProjects(false);
    }
    if (!authLoading && user) {
      fetchProjects();
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (projects !== undefined && !isFetchingProjects && user) {
      const hasAnimated = sessionStorage.getItem('dashboard_animated') === 'true';
      if (hasAnimated) {
        setAnimatePatterned(true);
        setAnimateGreen(true);
        const latestProject = projects?.[0];
        let target = 0;
        if (latestProject) {
          if (latestProject.status === "Validé") target = 100;
          else if (latestProject.status === "En cours de traitement") target = 60;
          else if (latestProject.status === "En attente") target = 20;
          else if (latestProject.status === "Rejeté") target = 15;
          else if (latestProject.status === "Brouillon") target = 5;
        }
        setDisplayPercent(target);
      } else {
        const t1 = setTimeout(() => setAnimatePatterned(true), 200);
        const t2 = setTimeout(() => setAnimateGreen(true), 700);
        return () => {
          clearTimeout(t1);
          clearTimeout(t2);
        };
      }
    }
  }, [projects, isFetchingProjects, user]);

  useEffect(() => {
    if (animateGreen && projects && user && sessionStorage.getItem('dashboard_animated') !== 'true') {
      const latestProject = projects?.[0];
      let target = 0;
      if (latestProject) {
        if (latestProject.status === "Validé") target = 100;
        else if (latestProject.status === "En cours de traitement") target = 60;
        else if (latestProject.status === "En attente") target = 20;
        else if (latestProject.status === "Rejeté") target = 15;
        else if (latestProject.status === "Brouillon") target = 5;
      }
      
      let start = 0;
      const duration = 2000; 
      const interval = 20;
      const steps = duration / interval;
      const increment = target / steps;
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setDisplayPercent(target);
          sessionStorage.setItem('dashboard_animated', 'true');
          clearInterval(timer);
        } else {
          setDisplayPercent(Math.floor(start));
        }
      }, interval);
      return () => clearInterval(timer);
    }
  }, [animateGreen, projects, user]);

  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setTimerSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      window.location.href = "/";
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FA]">
        <Loader2 className="w-8 h-8 animate-spin text-[#1B4332]" />
      </div>
    );
  }

  if (user) {
    if (projects === undefined || isFetchingProjects) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F7F9FA]">
          <Loader2 className="w-8 h-8 animate-spin text-[#1B4332]" />
        </div>
      );
    }
    const totalProjects = projects?.length || 0;
    const analysedProjects = projects?.filter(p => p.status === "Validé" || p.status === "Rejeté").length || 0;
    const runningProjects = projects?.filter(p => p.status === "En cours de traitement" || p.status === "En attente").length || 0;
    const pendingProjects = projects?.filter(p => p.status === "Brouillon").length || 0;

    // Calculate stats for current month
    const now = new Date();
    const projectsThisMonth = projects?.filter(p => {
      const date = new Date(p.created_at);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }) || [];

    const totalThisMonth = projectsThisMonth.length;
    const analysedThisMonth = projectsThisMonth.filter(p => p.status === "Validé" || p.status === "Rejeté").length;
    const runningThisMonth = projectsThisMonth.filter(p => p.status === "En cours de traitement" || p.status === "En attente").length;


    const latestProject = projects?.[0];
    let currentProgressPercent = 0;
    if (latestProject) {
      if (latestProject.status === "Validé") currentProgressPercent = 1.0;
      else if (latestProject.status === "En cours de traitement") currentProgressPercent = 0.6;
      else if (latestProject.status === "En attente") currentProgressPercent = 0.2;
      else if (latestProject.status === "Rejeté") currentProgressPercent = 0.15;
      else if (latestProject.status === "Brouillon") currentProgressPercent = 0.05;
    }
    
    const CIRCUMFERENCE = 125.66;
    const isValide = latestProject?.status === "Validé";
    
    const terminesPercent = isValide ? 1.0 : 0;
    const enCoursPercent = !isValide ? currentProgressPercent : 0;
    
    const enCoursOffset = CIRCUMFERENCE - (currentProgressPercent * CIRCUMFERENCE);
    const terminesOffset = CIRCUMFERENCE - (terminesPercent * CIRCUMFERENCE);
    
    const patternedPercent = Math.min(currentProgressPercent + 0.1, 1.0);
    const patternedOffset = CIRCUMFERENCE - (patternedPercent * CIRCUMFERENCE);

    return (
      <div className="bg-[#F7F9FA] min-h-screen -m-8 p-8 font-sans text-slate-900 rounded-tl-3xl shadow-[-10px_0_30px_rgba(0,0,0,0.02)]">
        {/* Top Navigation Bar */}
        <div className="flex justify-between items-center mb-10">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Rechercher un dossier..." 
              className="w-full bg-white rounded-full pl-12 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-[#1B4332] border border-slate-100 shadow-sm text-sm"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-100 px-2 py-1 rounded text-xs font-medium text-slate-500">
              ⌘F
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-3 bg-white rounded-full border border-slate-100 shadow-sm hover:shadow transition-shadow">
              <Mail className="w-5 h-5 text-slate-600" />
            </button>
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-3 bg-white rounded-full border border-slate-100 shadow-sm hover:shadow transition-all relative ${showNotifications ? 'ring-2 ring-emerald-500 border-emerald-200' : ''}`}
              >
                <Bell className={`w-5 h-5 transition-colors ${showNotifications ? 'text-emerald-600' : 'text-slate-600'}`} />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900">Notifications</h3>
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">1 NOUVELLE</span>
                  </div>
                  <div className="p-2">
                    <div className="flex gap-3 p-3 bg-emerald-50/30 hover:bg-emerald-50/50 rounded-xl transition-colors cursor-pointer group">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Bell className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-bold text-slate-900">Bienvenue !</p>
                          <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          Bienvenue sur votre espace investisseur {user?.user_metadata?.first_name || "M."}. Nous sommes ravis de vous accompagner dans vos projets d'investissement.
                        </p>
                        <p className="text-[10px] text-slate-400 mt-2 font-medium">À l'instant</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                    <button className="text-xs font-bold text-slate-500 hover:text-[#1B4332] transition-colors">
                      Marquer tout comme lu
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 ml-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-200 overflow-hidden flex items-center justify-center">
                <span className="text-emerald-700 font-bold uppercase">
                  {user?.user_metadata?.first_name?.[0]}{user?.user_metadata?.last_name?.[0] || user?.email?.[0] || "IN"}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-tight">
                  {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
                </p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-4xl font-semibold mb-2 tracking-tight text-slate-900">Tableau de bord</h1>
            <p className="text-slate-500 text-sm">Planifiez, priorisez et gérez vos projets d'investissement facilement.</p>
          </div>
          <div className="flex gap-4">
            <button className="bg-white border border-slate-200 px-6 py-3 rounded-full font-medium text-sm text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
              Importer des données
            </button>
            <Link href="/projets/nouveau" className="bg-[#1B4332] text-white px-6 py-3 rounded-full font-medium text-sm flex items-center gap-2 hover:bg-[#143226] transition-colors shadow-sm">
              <Plus className="w-4 h-4" />
              Nouveau Projet
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          {/* Card 1 */}
          <div className="bg-[#020617] text-white rounded-3xl p-6 relative overflow-hidden shadow-md">
            {/* Emerald Radial Glow Background */}
            <div
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `radial-gradient(circle 500px at 50% 300px, rgba(16,185,129,0.35), transparent)`,
              }}
            />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <p className="text-emerald-50 text-sm font-medium">Projets Totaux</p>
                <div className="bg-white rounded-full p-1.5 shadow-sm">
                  <ArrowUpRight className="w-4 h-4 text-[#1B4332]" />
                </div>
              </div>
              <p className="text-5xl font-semibold mb-6">{totalProjects}</p>
              <div className="flex items-center gap-2 text-[11px] font-medium">
                <span className="bg-[#2D5A44] px-2 py-1 rounded-md text-emerald-100 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +{totalThisMonth}
                </span>
                <span className="text-emerald-200/80">Augmentation ce mois</span>
              </div>
            </div>
          </div>
          {/* Card 2 */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/60">
            <div className="flex justify-between items-start mb-6">
              <p className="text-slate-900 text-sm font-medium">Projets Analysés</p>
              <div className="bg-white border border-slate-200 rounded-full p-1.5 shadow-sm">
                <ArrowUpRight className="w-4 h-4 text-slate-700" />
              </div>
            </div>
            <p className="text-5xl font-semibold mb-6 text-slate-900">{analysedProjects}</p>
            <div className="flex items-center gap-2 text-[11px] font-medium">
              <span className="bg-slate-100 px-2 py-1 rounded-md text-slate-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +{analysedThisMonth}
              </span>
              <span className="text-slate-400">Augmentation ce mois</span>
            </div>
          </div>
          {/* Card 3 */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/60">
            <div className="flex justify-between items-start mb-6">
              <p className="text-slate-900 text-sm font-medium">Projets en Cours</p>
              <div className="bg-white border border-slate-200 rounded-full p-1.5 shadow-sm">
                <ArrowUpRight className="w-4 h-4 text-slate-700" />
              </div>
            </div>
            <p className="text-5xl font-semibold mb-6 text-slate-900">{runningProjects}</p>
            <div className="flex items-center gap-2 text-[11px] font-medium">
              <span className="bg-slate-100 px-2 py-1 rounded-md text-slate-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +{runningThisMonth}
              </span>
              <span className="text-slate-400">Augmentation ce mois</span>
            </div>
          </div>
          {/* Card 4 */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/60">
            <div className="flex justify-between items-start mb-6">
              <p className="text-slate-900 text-sm font-medium">Projets en Attente</p>
              <div className="bg-white border border-slate-200 rounded-full p-1.5 shadow-sm">
                <ArrowUpRight className="w-4 h-4 text-slate-700" />
              </div>
            </div>
            <p className="text-5xl font-semibold mb-6 text-slate-900">{pendingProjects}</p>
            <div className="flex items-center gap-2 text-[11px] font-medium">
              <span className="text-orange-600 bg-orange-50 px-2 py-1 rounded-md">Brouillons à compléter</span>
            </div>
          </div>
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-12 gap-6 mb-6">
          {/* Analytics Chart */}
          <div className="col-span-6 bg-white rounded-3xl p-6 shadow-sm border border-slate-100/60 flex flex-col">
            <h2 className="font-semibold text-slate-900 mb-8">Évolution des Dépôts</h2>
            <div className="flex-1 flex items-end justify-between px-2 pb-2 gap-4 h-48">
              {/* Dummy Chart Bars */}
              {[40, 70, 60, 90, 75, 45, 50].map((h, i) => (
                <div key={i} className="flex flex-col items-center gap-3 w-full h-full justify-end">
                  {/* For pattern effect on certain bars */}
                  <div className={`w-full max-w-[40px] rounded-t-xl rounded-b-md relative overflow-hidden ${i === 3 ? 'bg-[#1B4332]' : i === 2 || i === 4 ? 'bg-[#4ADE80]' : 'bg-slate-100'}`} style={{ height: `${h}%` }}>
                    {(i === 0 || i === 5 || i === 6) && (
                      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, #000 5px, #000 6px)' }}></div>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 font-medium uppercase">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Reminders */}
          <div className="col-span-3 bg-white rounded-3xl p-6 shadow-sm border border-slate-100/60 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-4 -mt-4 opacity-50 pointer-events-none"></div>
            <div>
              <h2 className="font-semibold text-slate-900 mb-6">Rappels</h2>
              <h3 className="text-xl font-bold text-[#1B4332] leading-tight mb-3 pr-4">Réunion avec la commission CRI</h3>
              <p className="text-sm text-slate-500 mb-6">Time : 14h00 - 16h00</p>
            </div>
            <button className="w-full bg-[#1B4332] text-white rounded-full py-3.5 font-medium flex items-center justify-center gap-2 hover:bg-[#143226] transition-colors shadow-sm">
              <Video className="w-4 h-4" />
              Rejoindre la réunion
            </button>
          </div>

          {/* Recent Projects List */}
          <div className="col-span-3 bg-white rounded-3xl p-6 shadow-sm border border-slate-100/60 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-semibold text-slate-900">Dossiers</h2>
              <button className="text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-full font-medium hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-1">
                <Plus className="w-3 h-3" /> Nouveau
              </button>
            </div>
            <div className="space-y-4 flex-1 overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {projects?.slice(0, 4).map((project, i) => (
                <div key={project.id} className="flex gap-4 items-center group cursor-pointer">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm
                    ${project.status === "Brouillon" ? 'bg-orange-500' : i % 4 === 0 ? 'bg-blue-600' : i % 4 === 1 ? 'bg-emerald-500' : i % 4 === 2 ? 'bg-amber-500' : 'bg-purple-600'}`}
                  >
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-[#1B4332] transition-colors">{project.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wider truncate">Statut: {project.status}</p>
                  </div>
                </div>
              )) || <p className="text-sm text-slate-400">Aucun dossier en cours.</p>}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-12 gap-6">
          {/* Team / Interlocuteurs */}
          <div className="col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-slate-100/60 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-semibold text-slate-900">Collaboration CRI</h2>
              <Link href="/aide" className="text-xs border border-slate-200 px-3 py-1.5 rounded-full font-medium hover:bg-slate-50 transition-colors flex items-center gap-1 shadow-sm">
                <Plus className="w-3 h-3" /> Contacter
              </Link>
            </div>
            <div className="space-y-5">
              {[
                { name: "Ahmed El Fassi", role: "Chargé de suivi de dossier", status: "Terminé", color: "bg-emerald-50 text-emerald-700 border border-emerald-100", image: "/face1.webp" },
                { name: "Fatima Zahra", role: "Commission d'Investissement", status: "En cours", color: "bg-amber-50 text-amber-700 border border-amber-100", image: "/face2.webp" },
                { name: "Laila Bennani", role: "Département Juridique", status: "En attente", color: "bg-red-50 text-red-700 border border-red-100", image: "/face3.webp" },
              ].map((member, i) => (
                <div key={i} className="flex justify-between items-center group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200 relative">
                      <Image 
                        src={member.image} 
                        alt={member.name} 
                        fill 
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 group-hover:text-[#1B4332] transition-colors">{member.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">Contact pour {member.role}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-1 rounded-md ${member.color}`}>
                    {member.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Project Progress */}
          <div className="col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-slate-100/60 flex flex-col">
            <div className="w-full flex justify-between items-center mb-6">
              <h2 className="font-semibold text-slate-900">Progression Globale</h2>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center pt-2">
              <div className="relative w-48 h-24 mb-6">
                 <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                    <defs>
                      <pattern id="pattern-stripes-arc" width="2" height="2" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                        <rect width="1" height="2" fill="#64748b" opacity="0.9" />
                      </pattern>
                    </defs>
                    {/* Background (En attente) */}
                    <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#F1F5F9" strokeWidth="16" strokeLinecap="round" />
                    
                    {/* Patterned Projection Bar (10% more) - Stripes only */}
                    <path 
                      d="M 10 50 A 40 40 0 0 1 90 50" 
                      fill="none" 
                      stroke="url(#pattern-stripes-arc)" 
                      strokeWidth="16" 
                      strokeLinecap="round" 
                      strokeDasharray={CIRCUMFERENCE} 
                      strokeDashoffset={animatePatterned ? patternedOffset : CIRCUMFERENCE} 
                      className="transition-all duration-[2000ms] ease-out" 
                    />
                    
                    {/* En cours (Dark Green) */}
                    <path 
                      d="M 10 50 A 40 40 0 0 1 90 50" 
                      fill="none" 
                      stroke="#1B4332" 
                      strokeWidth="16" 
                      strokeLinecap="round" 
                      strokeDasharray={CIRCUMFERENCE} 
                      strokeDashoffset={animateGreen ? enCoursOffset : CIRCUMFERENCE} 
                      className="drop-shadow-sm transition-all duration-[2000ms] ease-out" 
                    />
                    
                    {/* Terminés (Bright Green) */}
                    <path 
                      d="M 10 50 A 40 40 0 0 1 90 50" 
                      fill="none" 
                      stroke="#34d399" 
                      strokeWidth="16" 
                      strokeLinecap="round" 
                      strokeDasharray={CIRCUMFERENCE} 
                      strokeDashoffset={animateGreen ? terminesOffset : CIRCUMFERENCE} 
                      className="transition-all duration-[2000ms] ease-out" 
                    />
                 </svg>
                 <div className="absolute bottom-[-12px] left-1/2 -translate-x-1/2 flex flex-col items-center">
                   <span className="text-4xl font-bold text-slate-900 tracking-tight leading-none">{displayPercent}%</span>
                   <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">Avancement</span>
                 </div>
              </div>
              <div className="flex gap-4 mt-auto text-[11px] font-medium text-slate-500">
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div> Terminés</div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#1B4332]"></div> En cours</div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-slate-200" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, #cbd5e1 2px, #cbd5e1 3px)' }}></div> En attente</div>
              </div>
            </div>
          </div>

          {/* Time Tracker */}
          <div className="col-span-3 bg-gradient-to-br from-[#1B4332] to-[#0A2617] rounded-3xl p-6 shadow-lg text-white relative overflow-hidden flex flex-col">
            <div className="absolute inset-0 bg-[url('/homepage.webp')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
            {/* Design elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500 rounded-full blur-3xl opacity-20"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#4ADE80] rounded-full blur-3xl opacity-10"></div>
            
            <div className="relative z-10 flex flex-col h-full">
              <h2 className="font-medium text-emerald-50 text-sm mb-6">Temps de Traitement</h2>
              <div className="flex-1 flex flex-col items-center justify-center pb-4">
                <p className="text-[2.75rem] font-bold tracking-tight mb-8 font-mono leading-none">{formatTime(timerSeconds)}</p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="w-12 h-12 rounded-full bg-white text-[#1B4332] flex items-center justify-center hover:bg-emerald-50 transition-colors shadow-lg"
                  >
                    {isTimerRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
                  </button>
                  <button 
                    onClick={() => {
                      setTimerSeconds(5048);
                      setIsTimerRunning(false);
                    }}
                    className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <Square className="w-4 h-4 fill-current" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Left Side: Authentication */}
      <div className="lg:w-1/2 p-6 md:p-10 flex flex-col overflow-y-auto">
        {/* Logo */}
        <div className="mb-12">
          <Image src="/cri-logo.png" alt="CRI Logo" width={180} height={70} className="w-auto h-12 object-contain" />
        </div>

        <div className="max-w-md w-full mx-auto md:ml-[10%] lg:ml-[15%] flex flex-col mt-auto mb-auto">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-10">
            Plateforme<br />
            Centre Régional<br />
            d'Investissement
          </h1>

          {/* Login Form */}
          <div className="w-full max-w-md">
            {error && <div className="mb-4 text-red-600 bg-red-50 p-3 rounded-lg text-sm">{error}</div>}
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Username or email address</label>
                <input 
                  type="text" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1B4332]" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1B4332]" 
                  required 
                />
              </div>
              <div className="flex items-center justify-between pt-2">
                <Link href="/sign-up" className="text-sm text-[#1B4332] hover:text-[#143226] font-medium hover:underline transition-all">
                  Sign up
                </Link>
                <Link href="/forgot-password" className="text-sm text-slate-500 hover:text-slate-700 font-medium hover:underline transition-all">
                  Forget password?
                </Link>
              </div>
              <button type="submit" className="w-full bg-[#1B4332] hover:bg-[#143226] text-white rounded-xl py-3 font-medium transition-colors mt-2 shadow-sm">
                Se connecter
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Right Side: Information & Branding */}
      <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center relative overflow-hidden bg-[#0A1F16] text-white">
        <div className="absolute inset-0 bg-[url('/homepage.webp')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        {/* Gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600 rounded-full blur-[128px] opacity-20 -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1B4332] rounded-full blur-[128px] opacity-40 -ml-20 -mb-20"></div>
        
        <div className="relative z-10 max-w-lg mx-auto lg:mx-0 w-full">
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
            Portail de l'Investisseur Intelligent
          </h1>
          <p className="text-emerald-50 text-lg mb-8 leading-relaxed opacity-90">
            Accédez à une plateforme moderne et intuitive pour soumettre, suivre et optimiser vos projets d'investissement dans la région de Laâyoune-Sakia El Hamra.
          </p>
          
          <div className="flex items-center gap-4 text-sm text-emerald-200/60 font-medium">
            <span>© {new Date().getFullYear()} CRI Laâyoune.</span>
            <span>Tous droits réservés.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
