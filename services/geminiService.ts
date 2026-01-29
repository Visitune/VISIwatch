import { GoogleGenAI } from "@google/genai";

export const analyzeRegulation = async (text: string, context: 'summary' | 'impact' | 'action'): Promise<string> => {
  // Use process.env.API_KEY directly as required by guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let prompt = "";
  
  switch (context) {
    case 'summary':
      prompt = `Tu es un expert en réglementation agroalimentaire et sécurité des aliments (HACCP, Paquet Hygiène). Résume le texte suivant de manière concise pour un responsable qualité. Mets en avant les points clés : \n\n${text}`;
      break;
    case 'impact':
      prompt = `En tant qu'expert Food Safety, analyse le texte suivant et liste les impacts potentiels pour une usine agroalimentaire (ex: mise à jour HACCP, étiquetage, contrôle réception). Sois direct et pragmatique : \n\n${text}`;
      break;
    case 'action':
      prompt = `Basé sur le texte réglementaire ou l'alerte suivante, propose une checklist d'actions immédiates (CAPA) pour un responsable qualité : \n\n${text}`;
      break;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.3, // Low temperature for factual analysis
        systemInstruction: "Tu es un assistant virtuel spécialisé en Food Safety et veille réglementaire (Galatée Pro, RASFF, EFSA). Tu réponds en français professionnel.",
      }
    });

    return response.text || "Aucune analyse générée.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message?.includes('403') || error.message?.includes('key')) {
        throw new Error("Clé API invalide ou expirée (Configuration Serveur).");
    }
    throw new Error("Erreur lors de l'analyse avec Gemini. Vérifiez votre connexion.");
  }
};