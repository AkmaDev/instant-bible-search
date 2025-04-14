// // i18n/client.ts
// "use client";

// import i18next from "./i18next";
// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { useTranslation, UseTranslationOptions, UseTranslationResponse } from "react-i18next";

// // Définir les clés de traduction directement ici
// type TranslationKeys = 
//   | "title"
//   | "description"
//   | "speak_phrase"
//   | "or_type"
//   | "get_verses"
//   | "no_results_found"
//   | "error_occured"
//   | "copy_share"
//   | "faq_title"
//   | "faq.q1"
//   | "faq.a1"
//   | "faq.q2"
//   | "faq.a2"
//   | "faq.q3"
//   | "faq.a3"
//   | "faq.q4"
//   | "faq.a4"
//   | "faq.q5"
//   | "faq.a5"
//   | "faq.q6";

// type Namespace = string | string[] | undefined;

// export function useT(
//   ns?: Namespace,
//   options?: UseTranslationOptions<TranslationKeys>  // Utiliser le type générique ici
// ): UseTranslationResponse<TranslationKeys, Namespace> {
//   const params = useParams();
//   const lng = params?.lng;

//   if (typeof lng !== "string") {
//     throw new Error("useT is only available inside /app/[lng]");
//   }

//   const [activeLng, setActiveLng] = useState(i18next.resolvedLanguage);

//   useEffect(() => {
//     if (activeLng !== i18next.resolvedLanguage) {
//       setActiveLng(i18next.resolvedLanguage);
//     }
//   }, [activeLng]);

//   useEffect(() => {
//     if (lng && i18next.resolvedLanguage !== lng) {
//       i18next.changeLanguage(lng);
//     }
//   }, [lng]);

//   return useTranslation(ns, options);
// }





// "use client";


// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { useTranslation, UseTranslationOptions, UseTranslationResponse } from "react-i18next";
// import i18next from "./i18next.client"; // Côté client seulement

// // Définir les clés de traduction directement ici
// type TranslationKeys = 
//   | "title"
//   | "description"
//   | "speak_phrase"
//   | "or_type"
//   | "get_verses"
//   | "you_said"
//   | "manual_input_placeholder"
//   | "no_results_found"
//   | "error_occured"
//   | "copy_share"
//   | "faq_title"
//   | "faq.q1"
//   | "faq.a1"
//   | "faq.q2"
//   | "faq.a2"
//   | "faq.q3"
//   | "faq.a3"
//   | "faq.q4"
//   | "faq.a4"
//   | "faq.q5"
//   | "faq.a5"
//   | "faq.q6";

// type Namespace = string | string[] | undefined;

// export function useT(
//   ns?: Namespace,
//   options?: UseTranslationOptions<TranslationKeys>
// ): UseTranslationResponse<TranslationKeys, Namespace> {
//   const params = useParams();
//   const lng = params?.lng;

//   // Assurer que lng est une chaîne de caractères (ou undefined) et pas un tableau.
//   const validLng = typeof lng === "string" ? lng : undefined;

//   // Initialiser l'état de la langue, avec une valeur par défaut.
//   const [activeLng, setActiveLng] = useState<string | undefined>(i18next.resolvedLanguage);

//   // Assurer que le hook useEffect est appelé une seule fois au montage
//   useEffect(() => {
//     if (validLng && validLng !== i18next.resolvedLanguage) {
//       i18next.changeLanguage(validLng);
//       setActiveLng(validLng); // Met à jour l'état de la langue active.
      
//     }
//   }, [validLng]); // Le hook se déclenche chaque fois que validLng change.

//   // Toujours appeler useTranslation, mais gérer les cas de langue
//   return useTranslation(ns, options);
// }



"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useTranslation, UseTranslationOptions, UseTranslationResponse } from "react-i18next";
import i18next from "./i18next.client"; // Côté client seulement

// Définir les clés de traduction directement ici
type TranslationKeys = 
  | "title"
  | "description"
  | "speak_phrase"
  | "or_type"
  | "get_verses"
  | "you_said"
  | "manual_input_placeholder"
  | "speech_not_supported"
  | "no_results_found"
  | "error_occured"
  | "copy_share"
  | "faq_title"
  | "faq.q1"
  | "faq.a1"
  | "faq.q2"
  | "faq.a2"
  | "faq.q3"
  | "faq.a3"
  | "faq.q4"
  | "faq.a4"
  | "faq.q5"
  | "faq.a5"
  | "faq.q6";

type Namespace = string | string[] | undefined;

export function useT(
  ns?: Namespace,
  options?: UseTranslationOptions<TranslationKeys>
): UseTranslationResponse<TranslationKeys, Namespace> {
  const params = useParams();
  const lng = params?.lng;

  // Assurer que lng est une chaîne de caractères (ou undefined) et pas un tableau.
  const validLng = typeof lng === "string" ? lng : undefined;

  // Assurer que le hook useEffect est appelé une seule fois au montage
  useEffect(() => {
    if (validLng && validLng !== i18next.resolvedLanguage) {
      i18next.changeLanguage(validLng); // Changer la langue si nécessaire
    }
  }, [validLng]); // Le hook se déclenche chaque fois que validLng change.

  // Toujours appeler useTranslation, mais gérer les cas de langue
  return useTranslation(ns, options);
}
