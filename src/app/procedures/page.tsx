"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Info, Trash2, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { askAiProcedure } from "@/app/actions/ai";
import { cn } from "@/lib/utils";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const SUGGESTIONS = [

  "Quelles sont les étapes pour créer une entreprise ?",
  "Quels sont les avantages de la zone d'accélération industrielle ?",
  "Comment obtenir une attestation de vocation non agricole ?",
  "Quels sont les secteurs les plus porteurs à Laâyoune ?"
];

export default function Procedures() {
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([
    { role: 'ai', content: "Bonjour ! Je suis l'assistant intelligent du CRI Laâyoune. Je peux vous aider avec les démarches administratives, le foncier industriel ou les incitations à l'investissement. Quelle est votre question ?" }
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleAsk = async (text?: string) => {
    const query = text || question;
    if (!query.trim() || isLoading) return;

    setQuestion("");
    setMessages(prev => [...prev, { role: 'user', content: query }]);
    setIsLoading(true);

    try {
      const response = await askAiProcedure(query);
      setMessages(prev => [...prev, { role: 'ai', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "Désolé, une erreur est survenue lors de la communication avec l'IA." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{ role: 'ai', content: "Chat réinitialisé. Comment puis-je vous aider ?" }]);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Guide des Procédures</h1>
          <p className="text-slate-500 mt-1">Intelligence Artificielle au service de l'investissement.</p>
        </div>
        <button 
          onClick={clearChat}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest pb-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Effacer la discussion
        </button>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden bg-white border-none shadow-2xl rounded-3xl">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
        >
          {messages.map((msg, i) => (
            <div key={i} className={cn("flex gap-4 max-w-[85%]", msg.role === 'user' ? "ml-auto flex-row-reverse" : "")}>
              <div className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-md transition-transform hover:scale-105",
                msg.role === 'ai' ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-600"
              )}>
                {msg.role === 'ai' ? <Bot className="w-6 h-6" /> : <User className="w-6 h-6" />}
              </div>
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                msg.role === 'ai' 
                  ? "bg-slate-50 text-slate-800 border border-slate-100 prose prose-slate prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:text-white" 
                  : "bg-slate-900 text-white prose prose-invert prose-sm max-w-none"
              )}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 max-w-[80%] animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-md">
                <Bot className="w-6 h-6" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
                <span className="text-sm text-slate-500 italic">L'expert CRI prépare votre réponse...</span>
              </div>
            </div>
          )}
        </div>

        {messages.length === 1 && !isLoading && (
          <div className="px-6 pb-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-emerald-500" />
              Suggestions rapides
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleAsk(s)}
                  className="text-xs bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full border border-emerald-100 hover:bg-emerald-100 transition-all font-medium"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleAsk(); }} 
            className="relative"
          >
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Posez votre question sur l'investissement..."
              className="w-full pl-6 pr-16 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-inner bg-white"
            />
            <button
              disabled={isLoading || !question.trim()}
              type="submit"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2.5 bg-emerald-700 text-white rounded-xl hover:bg-emerald-800 transition-all disabled:opacity-50 disabled:hover:bg-emerald-700 shadow-lg"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <div className="flex items-center gap-2 mt-4 text-[10px] text-slate-400 uppercase tracking-widest font-bold justify-center">
            <Info className="w-3 h-3" />
            Assistant intelligent • CRI Laâyoune-Sakia El Hamra
          </div>
        </div>
      </Card>
    </div>
  );
}

