"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import {
  type Locale,
  type TranslationKey,
  defaultLocale,
  getTranslation,
  getLocaleFromBrowser,
} from "./translations"

interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey) => string
}

const I18nContext = createContext<I18nContextValue>({
  locale: defaultLocale,
  setLocale: () => {},
  t: (key) => key,
})

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof window === "undefined") return defaultLocale
    const stored = localStorage.getItem("markdowntree-locale") as Locale | null
    return stored ?? getLocaleFromBrowser()
  })

  const handleSetLocale = useCallback((newLocale: Locale) => {
    setLocale(newLocale)
    if (typeof window !== "undefined") {
      localStorage.setItem("markdowntree-locale", newLocale)
    }
  }, [])

  const t = useCallback(
    (key: TranslationKey) => getTranslation(locale, key),
    [locale]
  )

  return (
    <I18nContext.Provider value={{ locale, setLocale: handleSetLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}
