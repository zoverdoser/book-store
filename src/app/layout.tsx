import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import './globals.scss'
import { Toaster } from '@/components/ui/toaster'
import { Navbar } from '@/components/Navbar'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/'
import { NextAuthProvider } from '@/components/providers/NextAuthProvider'

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
  const session = await getServerSession(authOptions)

  return (
    <html lang={locale}>
      <body className={`antialiased`}>
        <NextAuthProvider session={session}>
          <LanguageProvider initialLocale={locale}>
            <Navbar />
            {children}
          </LanguageProvider>
        </NextAuthProvider>
        <Toaster />
      </body>
    </html>
  )
}
