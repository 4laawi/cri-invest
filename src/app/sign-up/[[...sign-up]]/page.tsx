"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Page() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        }
      }
    });
    if (error) setError(error.message);
    else window.location.href = "/";
  };

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

          {/* Sign Up Form */}
          <div className="w-full max-w-md">
            {error && <div className="mb-4 text-red-600 bg-red-50 p-3 rounded-lg text-sm">{error}</div>}
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Prénom</label>
                  <input 
                    type="text" 
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
                  <input 
                    type="text" 
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                    required 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                  required 
                />
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-slate-600">Already have an account?</span>
                <Link href="/" className="text-sm text-emerald-700 hover:text-emerald-800 font-medium hover:underline transition-all">
                  Sign in
                </Link>
              </div>
              <button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl py-3 font-medium transition-colors mt-2">
                Sign Up
              </button>
            </form>
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
  );
}
