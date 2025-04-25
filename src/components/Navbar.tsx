'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useSession, signOut } from 'next-auth/react'
import { Button } from './ui/button'

export function Navbar() {
  const pathname = usePathname()
  const { data: session, status } = useSession()

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
      <div className="flex items-center gap-4">
        {status === 'loading' ? (
          <div>加载中...</div>
        ) : session ? (
          <div className="flex items-center gap-4">
            <span>{session.user?.email}</span>
            <Button variant="outline" onClick={() => signOut()}>
              退出
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">登录</Button>
            </Link>
            <Link href="/register">
              <Button>注册</Button>
            </Link>
          </div>
        )}
        <LanguageSwitcher />
      </div>
    </nav>
  )
}
