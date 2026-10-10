
"use client";

import { useEffect, useState } from "react";
import { Check, ChevronDown, Languages } from "lucide-react";

const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "ur", label: "Urdu", native: "اردو" },
  { code: "ar", label: "Arabic", native: "العربية" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "fr", label: "French", native: "Français" },
  { code: "es", label: "Spanish", native: "Español" },
  { code: "zh-CN", label: "Chinese", native: "中文" },
  { code: "de", label: "German", native: "Deutsch" },
];

const RTL_LANGUAGES = ["ur", "ar"];

function getSavedLanguage() {
  if (typeof window === "undefined") return "en";

  try {
    const saved = window.localStorage.getItem("computerhub-language");
    return LANGUAGES.some((language) => language.code === saved)
      ? saved
      : "en";
  } catch {
    return "en";
  }
}

export default function LanguageSwitcher() {
  const [language, setLanguage] = useState("en");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const savedLanguage = getSavedLanguage();

    setLanguage(savedLanguage);
    document.documentElement.lang = savedLanguage;
    document.documentElement.dir = RTL_LANGUAGES.includes(savedLanguage)
      ? "rtl"
      : "ltr";

    // Google Translate initializes this hidden element and translates
    // the page when the googtrans cookie contains a selected language.
    window.googleTranslateElementInit = () => {
      if (
        !window.google?.translate?.TranslateElement ||
        document.querySelector("#computerhub-google-translate .goog-te-combo")
      ) {
        return;
      }

      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "ur,ar,hi,fr,es,zh-CN,de",
          autoDisplay: false,
        },
        "computerhub-google-translate"
      );
    };

    const scriptId = "computerhub-google-translate-script";
    const existingScript = document.getElementById(scriptId);

    if (window.google?.translate?.TranslateElement) {
      window.googleTranslateElementInit();
    } else if (!existingScript) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    } else {
      // The script may already be loading; its callback is set above.
    }
  }, []);

  const chooseLanguage = (code) => {
    setOpen(false);
    setLanguage(code);

    try {
      window.localStorage.setItem("computerhub-language", code);
    } catch {
      // The language cookie can still be used if localStorage is unavailable.
    }

    document.documentElement.lang = code;
    document.documentElement.dir = RTL_LANGUAGES.includes(code)
      ? "rtl"
      : "ltr";

    // Remove any previous Google Translate language cookie.
    document.cookie = "googtrans=; path=/; max-age=0";
    document.cookie = "googtrans=; path=/; domain=" +
      window.location.hostname + "; max-age=0";

    if (code !== "en") {
      document.cookie = `googtrans=/en/${code}; path=/`;
    }

    // Reload so Google Translate applies the selected language consistently.
    window.location.reload();
  };

  const selectedLanguage =
    LANGUAGES.find((item) => item.code === language) || LANGUAGES[0];

  return (
    <>
      <div id="computerhub-google-translate" className="hidden" />

      <div className="relative z-50">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-label="Choose website language"
          aria-expanded={open}
          className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
        >
          <Languages size={18} />
          <span>{selectedLanguage.native}</span>
          <ChevronDown
            size={15}
            className={`transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <>
            <button
              type="button"
              aria-label="Close language menu"
              className="fixed inset-0 z-40 cursor-default"
              onClick={() => setOpen(false)}
            />

            <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
              <p className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                Select language
              </p>

              {LANGUAGES.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => chooseLanguage(item.code)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${
                    language === item.code
                      ? "bg-blue-50 font-semibold text-blue-700"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>
                    <span className="block">{item.native}</span>
                    <span className="block text-xs font-normal text-slate-400">
                      {item.label}
                    </span>
                  </span>

                  {language === item.code && <Check size={17} />}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <style jsx global>{`
        .goog-te-banner-frame.skiptranslate {
          display: none !important;
        }

        body {
          top: 0 !important;
        }

        #computerhub-google-translate {
          display: none !important;
        }

        .goog-te-gadget,
        .goog-te-gadget span,
        .goog-te-gadget a {
          display: none !important;
        }

        iframe.goog-te-menu-frame {
          max-width: 95vw !important;
        }
      `}</style>
    </>
  );
}
