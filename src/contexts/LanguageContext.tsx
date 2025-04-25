'use client'

import { createContext, useContext, useState, ReactNode, useMemo } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import Cookies from 'js-cookie'

const LANGUAGE_COOKIE_KEY = 'NEXT_LOCALE'

interface LanguageContextType {
  locale: string
  setLocale: (locale: string) => void
  isLoading: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// 预加载所有语言文件
const messagesMap = {
  'zh-CN': require('@/i18n/messages/zh-CN.json'),
  en: require('@/i18n/messages/en.json'),
}

export function LanguageProvider({ children, initialLocale = 'zh-CN' }: { children: ReactNode; initialLocale?: string }) {
  const [locale, setLocale] = useState(initialLocale)
  const [isLoading, setIsLoading] = useState(false)

  const handleSetLocale = (newLocale: string) => {
    setIsLoading(true)
    Cookies.set(LANGUAGE_COOKIE_KEY, newLocale, { expires: 365 })
    setLocale(newLocale)
    setIsLoading(false)
  }

  const messages = useMemo(() => messagesMap[locale as keyof typeof messagesMap], [locale])

  return (
    <LanguageContext.Provider value={{ locale, setLocale: handleSetLocale, isLoading }}>
      <NextIntlClientProvider
        locale={locale}
        timeZone={'Asia/Shanghai'}
        messages={messages}
        now={new Date()}
        onError={() => null}
      >
        {children}
      </NextIntlClientProvider>
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
