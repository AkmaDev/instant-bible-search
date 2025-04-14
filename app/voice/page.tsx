// "use client";
// import { useState, useEffect } from "react";

// // Typage des versets disponibles localement
// type Verse = {
//   ref: string;
//   text: string;
// };

// const verses: Record<string, Verse> = {
//   "jean 3 16": {
//     ref: "Jean 3:16",
//     text: "Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle.",
//   },
//   "psaume 23 1": {
//     ref: "Psaume 23:1",
//     text: "L'Éternel est mon berger: je ne manquerai de rien.",
//   },
//   "matthieu 6 33": {
//     ref: "Matthieu 6:33",
//     text: "Cherchez premièrement le royaume et la justice de Dieu; et toutes ces choses vous seront données par-dessus.",
//   },
// };

// // Types globaux pour la reconnaissance vocale
// declare global {
//   interface Window {
//     webkitSpeechRecognition: new () => SpeechRecognition;
//   }

//   interface SpeechRecognition {
//     start(): void;
//     lang: string;
//     interimResults: boolean;
//     maxAlternatives: number;
//     onresult: (event: SpeechRecognitionEvent) => void;
//     onerror: (event: SpeechRecognitionErrorEvent) => void;
//   }

//   interface SpeechRecognitionEvent {
//     results: SpeechRecognitionResult[];
//   }

//   interface SpeechRecognitionResult {
//     [index: number]: {
//       transcript: string;
//     };
//   }

//   interface SpeechRecognitionErrorEvent {
//     error: string;
//   }
// }

// // 🔥 Fonction qui interroge le LLM pour obtenir la clé du verset
// async function askLLM(transcript: string): Promise<string | null> {
//   try {
//     const response = await fetch(
//       "https://openrouter.ai/api/v1/chat/completions",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,

//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           model: "mistral/mistral-7b-instruct",
//           messages: [
//             {
//               role: "user",
//               content: `Donne-moi uniquement la référence biblique correspondant à cette phrase vocale : "${transcript}". Donne-la au format "jean 3 16" (tout en minuscules, avec espaces, sans ponctuation) ou écris "non trouvé" si ce n’est pas clair.`,
//             },
//           ],
//         }),
//       }
//     );

//     const data = await response.json();
//     const raw = data.choices?.[0]?.message?.content?.toLowerCase().trim();
//     console.log("🔁 Réponse LLM:", raw);
//     if (raw?.match(/^[a-z]+\s\d+\s\d+$/)) {
//       return raw;
//     }
//     return null;
//   } catch (error) {
//     console.error("Erreur LLM :", error);
//     return null;
//   }
// }

// export default function BibleVoiceApp() {
//   const [verse, setVerse] = useState<Verse | null>(null);
//   const [listening, setListening] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!("webkitSpeechRecognition" in window)) {
//       setError(
//         "La reconnaissance vocale n'est pas supportée par ce navigateur."
//       );
//     }
//   }, []);

//   const startListening = () => {
//     const recognition = new window.webkitSpeechRecognition();
//     recognition.lang = "fr-FR";
//     recognition.interimResults = false;
//     recognition.maxAlternatives = 1;

//     setListening(true);
//     recognition.start();

//     recognition.onresult = async (event: SpeechRecognitionEvent) => {
//       const transcript = Array.from(event.results)
//         .map((result) => result[0].transcript)
//         .join(" ");
//       console.log("🎧 Texte brut :", transcript);

//       const cleanedKey = await askLLM(transcript);
//       console.log("🧠 Clé détectée :", cleanedKey);

//       if (cleanedKey && verses[cleanedKey]) {
//         const foundVerse = verses[cleanedKey];
//         setVerse(foundVerse);
//         speakVerse(foundVerse.text);
//       } else {
//         setVerse({
//           ref: "Non trouvé",
//           text: "Aucun verset correspondant trouvé.",
//         });
//       }

//       setListening(false);
//     };

//     recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
//       console.error("Erreur vocale:", event.error);
//       setError("Erreur de reconnaissance vocale. Essayez encore.");
//       setListening(false);
//     };
//   };

//   const speakVerse = (text: string) => {
//     const synth = window.speechSynthesis;
//     const utter = new SpeechSynthesisUtterance(text);
//     utter.lang = "fr-FR";
//     synth.speak(utter);
//   };

//   return (
//     <div className="min-h-screen bg-white text-center p-8 flex flex-col items-center justify-center space-y-6">
//       <h1 className="text-2xl font-bold">📖 Bible Vocale</h1>
//       <p className="text-gray-600">
//         Clique sur le micro et dis un verset comme &quot;Jean chapitre trois
//         verset seize&quot;
//       </p>
//       <button
//         onClick={startListening}
//         className="bg-green-500 text-white py-3 px-6 rounded-full text-lg hover:bg-green-600 transition"
//         disabled={listening}
//       >
//         {listening ? "🎤 Écoute..." : "🎙️ Parler"}
//       </button>
//       {verse && (
//         <div className="bg-gray-100 p-6 rounded-xl shadow-md max-w-md">
//           <h2 className="text-xl font-semibold mb-2">{verse.ref}</h2>
//           <p className="text-gray-800">{verse.text}</p>
//         </div>
//       )}
//       {error && <p className="text-red-600">{error}</p>}
//     </div>
//   );
// }
