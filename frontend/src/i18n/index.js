import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import en from "./en.json"
import ru from "./ru.json"

const STORAGE_KEY = "lang"

export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" },
]

const stored = (() => {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
})()

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, ru: { translation: ru } },
  lng: LANGUAGES.some((l) => l.code === stored) ? stored : "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
})

i18n.on("languageChanged", (lng) => {
  try {
    localStorage.setItem(STORAGE_KEY, lng)
  } catch {
    // ignore
  }
  document.documentElement.lang = lng
})

document.documentElement.lang = i18n.language

export default i18n
