"use server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export async function analyzeProject(projectData: any) {
  const prompt = `
    En tant qu'expert en investissement pour le Centre Régional d'Investissement (CRI) de Laâyoune, Maroc, analysez ce projet :
    
    Nom: ${projectData.name}
    Description: ${projectData.description}
    Secteur: ${projectData.sector}
    Budget: ${projectData.budget} MAD
    Région: ${projectData.region}
    
    Retournez un JSON valide avec les champs suivants :
    - score (un nombre entre 0 et 100 basé sur la viabilité et l'impact local)
    - strengths (tableau de 3 à 5 points forts)
    - weaknesses (tableau de 3 à 5 points faibles ou défis)
    - administrative_steps (tableau des 5 étapes principales au Maroc/Laâyoune)
    - suggestions (tableau de 3 recommandations stratégiques)
    - estimated_timeline (ex: "6-12 mois")
    - risk_level (Faible / Modéré / Élevé)
    
    Répondez uniquement en JSON. Langue: Français.
  `;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "CRI Smart Portal Prototype",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }),
    });

    const data = await response.json();
    const content = data.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error("AI Analysis Error:", error);
    // Mock data for demo if API fails/missing key
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
}

export async function generateProjectDescription(idea: string) {
  const prompt = `
    Transformez cette idée de projet en une description professionnelle pour un dossier d'investissement au Maroc (Région Laâyoune).
    Idée: ${idea}
    Soyez concis, formel et convaincant. Environ 150 mots.
    Langue: Français.
  `;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    return "Description générée automatiquement pour le projet d'investissement à Laâyoune.";
  }
}

export async function askAiProcedure(question: string) {
  const prompt = `
    Répondez à cette question sur les procédures d'investissement à Laâyoune, Maroc.
    Question: ${question}
    Structurez la réponse avec : Étapes, Documents requis, et Délai estimé.
    Langue: Français.
  `;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    return "Désolé, l'assistant IA est temporairement indisponible. Veuillez contacter le CRI directement.";
  }
}
