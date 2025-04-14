"use client";

import React, { JSX, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

interface Verse {
  text: string;
  reference: string;
}

export default function VoiceToVerse() {
  const [verse, setVerse] = useState<JSX.Element | JSX.Element[] | string>("");
  const [loading, setLoading] = useState(false);
  const [manualText, setManualText] = useState("");
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const handleGetVerse = async (text: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: text }),
      });

      const data = await response.json();

      if (data.result && Array.isArray(data.result)) {
        const verses = data.result.map((verse: Verse, index: number) => (
          <div key={index} className="verse-container my-4">
            <p
              dangerouslySetInnerHTML={{
                __html: verse.text,
              }}
            />
            <p className="reference text-sm text-gray-500">{verse.reference}</p>
          </div>
        ));
        setVerse(verses);
      } else if (data.result) {
        setVerse(
          <div>
            <p
              dangerouslySetInnerHTML={{
                __html: data.result.text,
              }}
            />
            <p className="reference text-sm text-gray-500">
              {data.result.reference}
            </p>
          </div>
        );
      } else {
        setVerse("Aucun résultat trouvé.");
      }
    } catch (error) {
      console.error("Erreur :", error);
      setVerse("Erreur pendant la recherche");
    } finally {
      setLoading(false);
    }
  };

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <p>Votre navigateur ne supporte pas la reconnaissance vocale.</p>;
  }

  return (
    <main className="min-h-screen px-4 py-8 flex flex-col justify-center items-center bg-white text-gray-900">
      <div className="w-full max-w-xl space-y-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Recherche Biblique Vocale
          </h1>
          <p className="mt-2 text-gray-600">
            Parle ou écris une expression, trouve instantanément les versets
            bibliques correspondants.
          </p>
        </header>

        <div className="flex flex-col items-center space-y-3">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md shadow-sm disabled:opacity-50"
            onClick={() => {
              resetTranscript();
              SpeechRecognition.startListening({ language: "fr-FR" });
            }}
            disabled={listening}
          >
            🎤 {listening ? "Écoute en cours..." : "Parle maintenant"}
          </button>

          {transcript && (
            <>
              <p className="italic text-gray-700 text-center">
                Tu as dit : « {transcript} »
              </p>
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md shadow"
                onClick={() => handleGetVerse(transcript)}
              >
                Obtenir le verset 📖
              </button>
            </>
          )}
        </div>

        <div className="mt-6 space-y-3">
          <label
            htmlFor="manual-input"
            className="block text-sm font-medium text-gray-700"
          >
            Ou tape ton texte :
          </label>
          <textarea
            id="manual-input"
            className="border border-gray-300 rounded-md w-full p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
            rows={4}
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            placeholder="Ex: Dieu est amour, je suis le chemin, etc."
          />
          <button
            className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded-md"
            onClick={() => handleGetVerse(manualText)}
          >
            Obtenir le verset 📖
          </button>
        </div>

        {loading && (
          <p className="text-center text-blue-600 animate-pulse">
            Recherche du verset...
          </p>
        )}

        {verse && !loading && (
          <section className="mt-6 bg-purple-50 p-4 rounded-lg shadow-inner">
            <h2 className="text-lg font-semibold text-purple-700 mb-2">
              Résultat :
            </h2>
            <div className="text-purple-900 text-base leading-relaxed">
              {verse}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
