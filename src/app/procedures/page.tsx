"use client";

import { useState } from "react";
import { Send, Bot, User, Loader2, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { askAiProcedure } from "@/app/actions/ai";
import { cn } from "@/lib/utils";

export default function Procedures() {
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([
    { role: 'ai', content: "Bonjour ! Je suis l'assistant intelligent du CRI Laâyoune. Posez-moi vos questions sur les démarches administratives, les incitations fiscales ou les secteurs porteurs de la région." }
  ]);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    const userMsg = question;
    setQuestion("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    const response = await askAiProcedure(userMsg);
    
    setMessages(prev => [...prev, { role: 'ai', content: response }]);
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Guide des Procédures</h1>
        <p className="text-slate-500 mt-1">Consultez l'IA pour tout savoir sur l'investissement à Laâyoune.</p>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden bg-white border-none shadow-xl">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={cn("flex gap-4 max-w-[80%]", msg.role === 'user' ? "ml-auto flex-row-reverse" : "")}>
              <div className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                msg.role === 'ai' ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-600"
              )}>
                {msg.role === 'ai' ? <Bot className="w-6 h-6" /> : <User className="w-6 h-6" />}
              </div>
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed",
                msg.role === 'ai' ? "bg-slate-50 text-slate-800 border border-slate-100" : "bg-slate-900 text-white"
              )}>
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 max-w-[80%]">
              <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
                <Bot className="w-6 h-6" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
                <span className="text-sm text-slate-500 italic">L'IA réfléchit...</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
          <form onSubmit={handleAsk} className="relative">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Posez votre question ici..."
              className="w-full pl-6 pr-16 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
            />
            <button
              disabled={isLoading || !question.trim()}
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-emerald-700 text-white rounded-xl hover:bg-emerald-800 transition-all disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <div className="flex items-center gap-2 mt-4 text-[10px] text-slate-400 uppercase tracking-widest font-bold justify-center">
            <Info className="w-3 h-3" />
            Réponses générées par l'IA • Informations à titre indicatif
          </div>
        </div>
      </Card>
    </div>
  );
}
