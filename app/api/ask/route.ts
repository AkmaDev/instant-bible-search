import { NextRequest, NextResponse } from "next/server";

interface Verse {
  text: string;
  reference: string;
}

// const promptsByLanguage = {
//   "en-US": (searchTerm: string) =>
//     `Give me Bible verses that contain or are related to the phrase: "${searchTerm}". The answer must be in English.`,
//   "fr-FR": (searchTerm: string) =>
//     `Donne-moi des versets bibliques qui contiennent ou sont liés à l'expression : "${searchTerm}". La réponse doit être rédigée en français.`,
// };
const promptsByLanguage: {
  "en-US": (searchTerm: string) => string;
  "fr-FR": (searchTerm: string) => string;
} = {
  "en-US": (searchTerm) =>
    `Give me Bible verses that contain or are related to the phrase: "${searchTerm}" in English. Format the results clearly.`,
  "fr-FR": (searchTerm) =>
    `Donne-moi des versets bibliques qui contiennent ou sont liés à l'expression : "${searchTerm}" en français. Formate bien les résultats.`,
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const searchTerm = body.transcript; // L'expression recherchée par l'utilisateur
    const supportedLanguages = ["en-US", "fr-FR"] as const;

    // Vérifie que la langue est supportée
    const language = supportedLanguages.includes(body.language)
      ? (body.language as (typeof supportedLanguages)[number])
      : "en-US";

    const prompt = promptsByLanguage[language](searchTerm);


    console.log("Prompt sent to OpenRouter:", prompt);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
      }),
    });

    const data = await response.json();

    console.log("Réponse reçue de l'API OpenRouter :");
    console.dir(data, { depth: null });

    if (data?.choices?.[0]?.message?.content) {
      
      // Remplacer l'expression recherchée par l'utilisateur par du HTML avec du surlignage
      const highlightedContent = data.choices[0].message.content.replace(
        new RegExp(`(${searchTerm})`, 'gi'),  // Utilisation de RegExp pour remplacer toutes les occurrences
        '<mark>$1</mark>' // Le texte trouvé sera surligné
      );

      
      // Formater la réponse pour renvoyer les versets avec texte et référence
      const verses: Verse[] = highlightedContent.split("\n").map((verseText: string) => {
        const [text, reference] = verseText.split(" - ");
        return { text, reference };
      });

      return NextResponse.json({ result: verses });
    } else {
      return NextResponse.json({ result: "Aucun verset trouvé." });
    }
  } catch (error) {
    console.error("Erreur dans /api/ask :", error);
    return NextResponse.json(
      { result: "Une erreur est survenue. Veuillez réessayer." },
      { status: 500 }
    );
  }
}




