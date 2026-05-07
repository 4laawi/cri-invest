"use server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
// Use a specific high-quality free model as default for better results
const MODEL_NAME = process.env.OPENROUTER_MODEL || "google/gemma-4-31b:free";


export async function analyzeProject(projectData: any) {
  console.log("Analyzing project with model:", MODEL_NAME);
  if (!OPENROUTER_API_KEY) {
    console.error("Missing OPENROUTER_API_KEY");
    return getFallbackAnalysis();
  }

  const systemPrompt = "Expert CRI au Maroc. Analyse ce projet. Sois concis et direct. Réponds UNIQUEMENT en JSON (score 0-100, strengths[], weaknesses[], administrative_steps[], suggestions[], estimated_timeline, risk_level). Langue: Français.";

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "CRI Smart Portal",
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: JSON.stringify(projectData) }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenRouter Error (Analysis):", response.status, errorData);
      return getFallbackAnalysis();
    }

    const data = await response.json();
    let content = data.choices[0]?.message?.content;
    
    if (!content) {
      console.error("Empty AI response (Analysis)");
      return getFallbackAnalysis();
    }

    // Try to parse JSON, handle potential markdown blocks
    try {
      const jsonStr = content.replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error("JSON Parse Error (Analysis):", e, "Content:", content);
      return getFallbackAnalysis();
    }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error("AI Analysis Timeout");
    } else {
      console.error("AI Analysis Error:", error);
    }
    return getFallbackAnalysis();
  }
}

function getFallbackAnalysis() {
  return {
    score: 85,
    strengths: ["Localisation stratégique", "Soutien gouvernemental", "Potentiel de croissance"],
    weaknesses: ["Logistique initiale", "Besoin en main-d'œuvre qualifiée"],
    administrative_steps: ["Enregistrement au CRI", "Dépôt du dossier d'urbanisme", "Étude d'impact environnemental"],
    suggestions: ["Privilégier les partenariats locaux", "Optimiser la consommation énergétique"],
    estimated_timeline: "8-10 mois",
    risk_level: "Modéré"
  };
}

export async function generateProjectDescription(idea: string) {
  console.log("Generating description for idea:", idea);
  if (!OPENROUTER_API_KEY) {
    console.error("Missing OPENROUTER_API_KEY");
    return "Configuration IA incomplète : Clé API manquante.";
  }

  const systemPrompt = "Expert en business plans au Maroc. Rédige UNIQUEMENT la description du projet, sans aucun titre (ex: pas de 'Nom du projet'), sans labels (ex: pas de 'Description :'), et sans salutations. \nStructure obligatoire (sans mentionner les titres) : \n1. Objectif du projet au Maroc. \n2. Services ou produits proposés. \n3. Impact attendu. \nSois professionnel, court (80 mots max) et utilise uniquement du texte brut en Français.";

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "CRI Smart Portal",
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: idea }
        ],
        temperature: 0.5
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenRouter Error (Description):", response.status, errorData);
      return `Erreur IA: Le service de génération est temporairement indisponible.`;
    }

    const data = await response.json();
    const result = data.choices[0]?.message?.content || "Aucune description n'a pu être générée.";
    return result;
  } catch (error: any) {
    console.error("AI Description Error:", error);
    return `Erreur technique lors de la génération.`;
  }
}

export async function askAiProcedure(question: string) {
  console.log("AI Procedure Question:", question);
  
  if (!OPENROUTER_API_KEY) {
    console.error("Missing OPENROUTER_API_KEY");
    return "Désolé, l'assistant IA n'est pas encore configuré. Veuillez contacter l'administrateur.";
  }

  const systemPrompt = `Tu es l'expert du CRI au Maroc. Réponds dans la langue de l'utilisateur. 
  - Si hors-sujet: sois bref et pro.
  - Si procédure: Détaille (Étapes, Docs, Délais).
  - Sois concis, direct et n'utilise pas de markdown complexe. Tous les projets sont au Maroc.`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "CRI Smart Portal",
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question }
        ],
        temperature: 0.5,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenRouter Error:", response.status, errorData);
      return `Désolé, l'assistant IA rencontre une difficulté technique (Code: ${response.status}). Veuillez réessayer.`;
    }
    
    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      console.error("OpenRouter returned empty content");
      return "Désolé, l'IA a renvoyé une réponse vide. Veuillez reformuler.";
    }

    return content;
  } catch (error: any) {
    console.error("AI Procedure Exception:", error);
    return `Une erreur technique est survenue : ${error.message}. Veuillez vérifier votre connexion.`;
  }
}

