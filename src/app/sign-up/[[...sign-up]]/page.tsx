"use client";
import Link from "next/link";
import { useState } from "react";
import { createBrowserClient } from '@supabase/ssr'

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) setError(error.message);
    else window.location.href = "/";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-md mx-auto p-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm w-full">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Inscription</h1>
        <p className="text-slate-500 mb-6">Créez votre compte</p>
        
        {error && <div className="mb-4 text-red-600 bg-red-50 p-3 rounded-lg text-sm">{error}</div>}
        
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mot de passe</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" 
              required 
            />
          </div>
          <button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl py-3 font-medium transition-colors">
            S'inscrire
          </button>
        </form>
      </div>

      <div className="mt-8 text-center text-slate-600">
        Vous avez déjà un compte ?{" "}
        <Link 
          href="/sign-in" 
          className="text-emerald-700 hover:text-emerald-800 font-medium hover:underline transition-all"
        >
          Se connecter
        </Link>
      </div>
    </div>
  );
}
