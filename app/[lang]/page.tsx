// app/page.tsx or wherever your homepage is
"use client";
import React, { JSX, useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import Head from "next/head";
import i18next from "i18next";
import { useT } from "../i18n/client";
// import { useTranslation } from "react-i18next";
import { useParams, useRouter } from "next/navigation";
// import { initI18n } from "../i18n/client";

interface Verse {
  text: string;
  reference: string;
}

const MAX_RECORDING_TIME = 30 * 1000; // 30 secondes

export default function InstantBibleSearch() {
  const { t } = useT(); // Initialiser la fonction de traduction
  const [verse, setVerse] = useState<JSX.Element | JSX.Element[] | string>("");
  const [loading, setLoading] = useState(false);
  const [manualText, setManualText] = useState("");
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [speechAvailable, setSpeechAvailable] = useState(true);
  // const [mounted, setMounted] = useState(false);
  // const [ready, setReady] = useState(false);

  const params = useParams();
  const langParam = params?.lang ?? "en"; // valeur par défaut

  useEffect(() => {
    const langCode = langParam === "fr" ? "fr" : "en"; // fallback
    i18next.changeLanguage(langCode);
    setSelectedLanguage(langCode === "fr" ? "fr-FR" : "en-US");
  }, [langParam]);

  const [selectedLanguage, setSelectedLanguage] = useState("en-US"); // Default language is English

  const router = useRouter();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    const nextLangParam = newLang === "fr-FR" ? "fr" : "en";

    // Change la langue dans i18next
    i18next.changeLanguage(nextLangParam);

    // Navigue vers la nouvelle route
    router.push(`/${nextLangParam}`);
  };

  useEffect(() => {
    if (listening) {
      const timer = setTimeout(() => {
        SpeechRecognition.stopListening();
        alert("L'enregistrement a été arrêté.");
      }, MAX_RECORDING_TIME);

      return () => clearTimeout(timer); // Nettoyage du timer à la fin
    }
  }, [listening]);

  const copyVerseToClipboard = () => {
    const element = document.getElementById("verse-results");
    if (element) {
      const textToCopy = element.innerText;
      navigator.clipboard.writeText(textToCopy).then(() => {
        alert(t("Verses copied to clipboard! 📋"));
      });
    }
  };

  const handleGetVerse = async (text: string) => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: text, language: selectedLanguage }),
      });

      const data = await res.json();

      if (data.result && Array.isArray(data.result)) {
        const verses = data.result.map((verse: Verse, index: number) => (
          <div key={index} className="my-4">
            <p dangerouslySetInnerHTML={{ __html: verse.text }} />
            <p className="text-sm text-gray-500">{verse.reference}</p>
          </div>
        ));
        setVerse(verses);
      } else if (data.result) {
        setVerse(
          <div>
            <p dangerouslySetInnerHTML={{ __html: data.result.text }} />
            <p className="text-sm text-gray-500">{data.result.reference}</p>
          </div>
        );
      } else {
        setVerse(t("no_results_found"));
      }
    } catch (error) {
      console.error("Error fetching verse:", error);
      setVerse("error_occured");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isSupported = SpeechRecognition.browserSupportsSpeechRecognition();
    setSpeechAvailable(isSupported);
  }, []);

  // useEffect(() => {
  //   setMounted(true);
  //   initI18n().then(() => setReady(true));
  // }, []);

  // if (!mounted || !ready) return null;

  return (
    <>
      <Head>
        <title>Instant Bible Search - AI-powered verse finder</title>
        <meta name="description" content={t("description")} />
        <meta
          name="keywords"
          content="Bible, verse search, scripture, voice bible search, AI bible, Bible AI tool"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "How does Instant Bible Search work?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Our tool uses advanced AI technology to analyze your spoken or written input, understand its meaning, and instantly match it to relevant Bible verses from multiple translations.",
                },
              },
              {
                "@type": "Question",
                name: "Do I need to create an account?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "No, Instant Bible Search is completely free and does not require any account or login. Just speak or type, and you’ll get results immediately.",
                },
              },
              {
                "@type": "Question",
                name: "Which Bible versions are supported?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "The app currently uses a combination of public domain versions and translations supported by our AI model, including the King James Version (KJV), World English Bible (WEB), and others.",
                },
              },
              {
                "@type": "Question",
                name: "Can I use this tool offline?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Not yet. Voice recognition and AI processing require an internet connection, but we are working on a future version that will support offline access and local languages.",
                },
              },
              {
                "@type": "Question",
                name: "Is this available in other languages?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "English is supported by default, but support for other languages (French, Spanish, Fongbé, etc.) is coming soon!",
                },
              },
              {
                "@type": "Question",
                name: "Can I share the results?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes! You can copy and share the Bible verses you find with others on social media, email, or messaging apps.",
                },
              },
            ],
          })}
        </script>
      </Head>

      <main className="min-h-screen bg-white text-gray-900 px-4 py-8 flex flex-col items-center justify-start">
        <div className="w-full max-w-2xl space-y-8">
          <header className="text-center relative">
            <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
            <p className="mt-2 text-gray-600 text-lg">{t("description")}</p>
            <div className="absolute top-0 -right-72">
              <select
                value={selectedLanguage}
                onChange={handleLanguageChange}
                className="border rounded-md p-2"
                aria-label="Select language"
              >
                <option value="en-US">English</option>
                <option value="fr-FR">Français</option>
              </select>
            </div>
          </header>

          {!speechAvailable && (
            <p className="text-sm text-red-600 text-center">
              {t("speech_not_supported") ??
                "🎤 Your browser doesn't support voice search. You can still type below."}
            </p>
          )}

          <div className="flex flex-col items-center space-y-3">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md shadow-sm disabled:opacity-50"
              onClick={() => {
                resetTranscript();
                SpeechRecognition.startListening({
                  language: selectedLanguage,
                });
              }}
              disabled={listening || !speechAvailable}
            >
              🎤 {listening ? "Listening..." : t("speak_phrase")}
            </button>

            {listening && (
              <div className="flex items-center justify-center space-x-1 mt-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 h-6 bg-blue-600 rounded animate-pulse"
                    style={{
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: "0.8s",
                      animationIterationCount: "infinite",
                      animationName: "wave",
                    }}
                  ></div>
                ))}
                <style jsx>{`
                  @keyframes wave {
                    0%,
                    100% {
                      transform: scaleY(0.4);
                    }
                    50% {
                      transform: scaleY(1);
                    }
                  }
                `}</style>
              </div>
            )}

            {transcript && (
              <>
                <p className="italic text-gray-700 text-center">
                  {t("you_said")}: “{transcript}”
                </p>
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md shadow"
                  onClick={() => handleGetVerse(transcript)}
                >
                  {t("get_verses")} 📖
                </button>
              </>
            )}
          </div>

          <div className="space-y-3">
            <label htmlFor="manual-input">{t("or_type")}</label>
            <textarea
              id="manual-input"
              className="border border-gray-300 rounded-md w-full p-3 focus:ring-2 focus:ring-blue-400 text-sm"
              rows={4}
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              placeholder={t("manual_input_placeholder")}
            />
            <button
              className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded-md"
              onClick={() => handleGetVerse(manualText)}
            >
              {t("get_verses")} 📖
            </button>
          </div>

          {loading && (
            <p className="text-center text-blue-600 animate-pulse">
              {t("searching")}...
            </p>
          )}

          {verse && !loading && (
            <>
              <section className="mt-6 bg-purple-50 p-4 rounded-lg shadow-inner">
                <h2 className="text-lg font-semibold text-purple-700 mb-2">
                  {t("results")}
                </h2>
                <div
                  id="verse-results"
                  className="text-purple-900 text-base leading-relaxed"
                >
                  {verse}
                </div>
              </section>
              <div className="text-right mt-3">
                <button
                  onClick={copyVerseToClipboard}
                  aria-label="Copy the verse to clipboard and share"
                  className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 transition"
                >
                  📋 {t("copy_share")}
                </button>
              </div>
            </>
          )}

          <section className="mt-12 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">
              {t("faq_title")}
            </h2>

            <div className="space-y-4 text-gray-800">
              <details className="bg-gray-100 rounded-md p-4 shadow-sm">
                <summary className="font-semibold cursor-pointer">
                  {t("faq.q1")}
                </summary>
                <p className="mt-2">{t("faq.a1")}</p>
              </details>

              <details className="bg-gray-100 rounded-md p-4 shadow-sm">
                <summary className="font-semibold cursor-pointer">
                  {t("faq.q2")}
                </summary>
                <p className="mt-2">{t("faq.a2")}</p>
              </details>

              <details className="bg-gray-100 rounded-md p-4 shadow-sm">
                <summary className="font-semibold cursor-pointer">
                  {t("faq.q3")}
                </summary>
                <p className="mt-2">{t("faq.a3")}</p>
              </details>

              <details className="bg-gray-100 rounded-md p-4 shadow-sm">
                <summary className="font-semibold cursor-pointer">
                  {t("faq.q4")}
                </summary>
                <p className="mt-2">{t("faq.a4")}</p>
              </details>

              <details className="bg-gray-100 rounded-md p-4 shadow-sm">
                <summary className="font-semibold cursor-pointer">
                  {t("faq.q5")}
                </summary>
                <p className="mt-2">{t("faq.a5")}</p>
              </details>

              <details className="bg-gray-100 rounded-md p-4 shadow-sm">
                <summary className="font-semibold cursor-pointer">
                  {t("faq.q6")}
                </summary>
                <p className="mt-2">{t("faq.a6")}</p>
              </details>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
