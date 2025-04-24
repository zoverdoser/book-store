import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { Navbar } from '@/components/Navbar'
import { LanguageProvider } from '@/contexts/LanguageContext'

export const metadata: Metadata = {
  title: '书店',
  description: '一个简单的书店应用',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'zh-CN'

  return (
    <html lang={locale}>
      <body className={`antialiased`}>
        <LanguageProvider initialLocale={locale}>
          <Navbar />
          {children}
        </LanguageProvider>
        <Toaster />
      </body>
    </html>
  )
}
