'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LanguageSwitcher } from './LanguageSwitcher'

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-sm">
      <div className="flex items-center gap-6">
        <Link href="/" className="text-xl font-bold">
          书店
        </Link>
        <div className="flex gap-4">
          <Link href="/books" className={`hover:text-primary ${pathname === '/books' ? 'text-primary' : ''}`}>
            图书
          </Link>
          <Link href="/about" className={`hover:text-primary ${pathname === '/about' ? 'text-primary' : ''}`}>
            关于
          </Link>
        </div>
      </div>
      <LanguageSwitcher />
    </nav>
  )
}
