'use client'

import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/LanguageContext'

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage()

  return (
    <div className="flex gap-2">
      <Button variant={locale === 'zh-CN' ? 'default' : 'outline'} onClick={() => setLocale('zh-CN')}>
        中文
      </Button>
      <Button variant={locale === 'en' ? 'default' : 'outline'} onClick={() => setLocale('en')}>
        English
      </Button>
    </div>
  )
}
