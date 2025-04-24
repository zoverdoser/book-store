import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import { Language } from '@/types'

export function generateStaticParams() {
  return [{ locale: 'zh-CN' }, { locale: 'en' }]
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: Language }
}) {
  let messages
  try {
    messages = (await import(`@/i18n/messages/${locale}.json`)).default
  } catch (error) {
    notFound()
  }

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
