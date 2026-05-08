// ============================================================
// useLanguage — Antigravity i18n Engine
// Stores preference in localStorage key: 'statslab_lang'
// Provides: { t, lang, setLang }
// Transition: <16ms, no page reload
// ============================================================
import { createContext, useContext, useState, useCallback } from 'react'
import { locales } from '../data/locales'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem('statslab_lang') || 'id'
  })

  const setLang = useCallback((newLang) => {
    localStorage.setItem('statslab_lang', newLang)
    setLangState(newLang)
  }, [])

  // Deep key resolver: t('onboarding.title') → string
  const t = useCallback((keyPath) => {
    const keys = keyPath.split('.')
    let value = locales[lang]
    for (const key of keys) {
      if (value === undefined || value === null) return keyPath
      value = value[key]
    }
    return value ?? keyPath
  }, [lang])

  return (
    <LanguageContext.Provider value={{ t, lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be inside LanguageProvider')
  return ctx
}
