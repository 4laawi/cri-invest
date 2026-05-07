"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Loader2, ShieldCheck, Lock, Mail, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) throw loginError;

      // Check for admin role in metadata
      const userRole = data.user?.user_metadata?.role;
      
      // For now, let's allow "admin@cri.ma" or anyone with metadata role 'admin'
      // Or if you want to test, I can add a way to promote yourself
      if (userRole === 'admin' || email === "admin@cri.ma") {
        // If it's the special email and no role yet, let's update it
        if (!userRole && email === "admin@cri.ma") {
           await supabase.auth.updateUser({
             data: { role: 'admin' }
           });
        }
        router.push("/admin/dashboard");
      } else {
        await supabase.auth.signOut();
        setError("Accès refusé. Vous n'avez pas les privilèges administrateur.");
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de la connexion.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] -mr-64 -mt-64"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -ml-64 -mb-64"></div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo & Header */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mb-6 border border-emerald-500/20 shadow-xl shadow-emerald-500/5">
            <ShieldCheck className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Espace Administration</h1>
          <p className="text-slate-400 text-sm">Gestion du portail CRI Smart Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></div>
              {error}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Professionnel</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@cri.ma"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all placeholder:text-slate-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Mot de passe</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all placeholder:text-slate-600"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20 mt-4"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Connexion Sécurisée
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <Link href="/" className="text-slate-500 text-sm hover:text-white transition-colors font-medium">
            ← Retour au portail investisseur
          </Link>
        </div>
      </div>
    </div>
  );
}
