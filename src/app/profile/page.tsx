"use client";
import { User, Mail, Phone, Bell, Shield, Key, Save, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { createBrowserClient } from '@supabase/ssr';

export default function ProfilePage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [notifyDossiers, setNotifyDossiers] = useState(true);
  const [notifyMessages, setNotifyMessages] = useState(true);
  const [notifyNewsletter, setNotifyNewsletter] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || "");
        setFirstName(user.user_metadata?.first_name || "");
        setLastName(user.user_metadata?.last_name || "");
        setPhone(user.user_metadata?.phone || "");
      }
      setLoading(false);
    }
    loadUser();
  }, [supabase.auth]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.auth.updateUser({
      data: {
        first_name: firstName,
        last_name: lastName,
        phone: phone,
      }
    });
    setSaving(false);
    if (!error) {
      setToastMessage("Modifications enregistrées avec succès");
      setTimeout(() => setToastMessage(""), 3000);
    } else {
      setToastMessage("Erreur lors de l'enregistrement");
      setTimeout(() => setToastMessage(""), 3000);
    }
  };

  if (loading) {
    return <div className="p-8 max-w-5xl mx-auto flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B4332]"></div></div>;
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 relative">
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-emerald-50 text-emerald-900 px-4 py-3 rounded-lg shadow-lg border border-emerald-200 animate-in fade-in slide-in-from-top-4">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <p className="text-sm font-medium">{toastMessage}</p>
        </div>
      )}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Mon Profil</h1>
        <p className="text-slate-500">Gérez vos informations personnelles et vos préférences de compte.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Profile info form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">Informations Personnelles</h2>
              <p className="text-sm text-slate-500 mt-1">Mettez à jour vos coordonnées et informations publiques.</p>
            </div>
            
            <div className="p-6 space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center border-4 border-white shadow-md relative overflow-hidden group">
                  <User className="w-10 h-10 text-slate-400 group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                    <span className="text-white text-xs font-medium">Modifier</span>
                  </div>
                </div>
                <div>
                  <button className="px-4 py-2 bg-white border border-slate-200 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm">
                    Changer la photo
                  </button>
                  <p className="text-xs text-slate-500 mt-2">JPG, GIF ou PNG. 1MB max.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Prénom</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-slate-400 group-focus-within:text-[#1B4332] transition-colors" />
                    </div>
                    <input 
                      type="text" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332] bg-slate-50 focus:bg-white transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Nom</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-slate-400 group-focus-within:text-[#1B4332] transition-colors" />
                    </div>
                    <input 
                      type="text" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332] bg-slate-50 focus:bg-white transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Email</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-slate-400 group-focus-within:text-[#1B4332] transition-colors" />
                    </div>
                    <input 
                      type="email" 
                      value={email}
                      readOnly
                      className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-100 text-slate-500 cursor-not-allowed outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Téléphone</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-slate-400 group-focus-within:text-[#1B4332] transition-colors" />
                    </div>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ajouter un numéro de téléphone"
                      className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332] bg-slate-50 focus:bg-white transition-all outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#1B4332] hover:bg-[#143226] text-white rounded-xl text-sm font-medium transition-all shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {saving ? "Enregistrement..." : "Enregistrer les modifications"}
              </button>
            </div>
          </div>
        </div>

        {/* Right column: Notification and Security settings */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
              <div className="p-2 bg-emerald-50 text-[#1B4332] rounded-lg">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-md font-semibold text-slate-900">Notifications</h2>
                <p className="text-xs text-slate-500">Gérez vos alertes.</p>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <label className="flex items-center justify-between cursor-pointer group" onClick={(e) => { e.preventDefault(); setNotifyDossiers(!notifyDossiers); }}>
                <div>
                  <p className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">Mises à jour des dossiers</p>
                  <p className="text-xs text-slate-500">Soyez notifié de l'état d'avancement.</p>
                </div>
                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shadow-inner ${notifyDossiers ? 'bg-[#1B4332]' : 'bg-slate-200'}`}>
                  <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform shadow-sm ${notifyDossiers ? 'translate-x-6' : 'translate-x-1'}`} />
                </div>
              </label>

              <label className="flex items-center justify-between cursor-pointer group" onClick={(e) => { e.preventDefault(); setNotifyMessages(!notifyMessages); }}>
                <div>
                  <p className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">Messages de l'administration</p>
                  <p className="text-xs text-slate-500">Recevoir un email pour les nouveaux messages.</p>
                </div>
                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shadow-inner ${notifyMessages ? 'bg-[#1B4332]' : 'bg-slate-200'}`}>
                  <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform shadow-sm ${notifyMessages ? 'translate-x-6' : 'translate-x-1'}`} />
                </div>
              </label>

              <label className="flex items-center justify-between cursor-pointer group" onClick={(e) => { e.preventDefault(); setNotifyNewsletter(!notifyNewsletter); }}>
                <div>
                  <p className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">Newsletter CRI</p>
                  <p className="text-xs text-slate-500">Actualités et opportunités.</p>
                </div>
                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shadow-inner ${notifyNewsletter ? 'bg-[#1B4332]' : 'bg-slate-200'}`}>
                  <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform shadow-sm ${notifyNewsletter ? 'translate-x-6' : 'translate-x-1'}`} />
                </div>
              </label>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-md font-semibold text-slate-900">Sécurité</h2>
                <p className="text-xs text-slate-500">Sécurisez votre compte.</p>
              </div>
            </div>
            <div className="p-6">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-sm font-medium text-slate-700 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm active:scale-[0.98]">
                <Key className="w-4 h-4 text-slate-500" />
                Changer le mot de passe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
