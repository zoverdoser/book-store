'use client'

import { SessionProvider } from 'next-auth/react'
import { Session } from 'next-auth'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  session: Session | null
}

export function NextAuthProvider({ children, session }: Props) {
  return (
    <SessionProvider
      session={session}
      refetchInterval={5 * 60} // 每5分钟刷新一次会话
      refetchOnWindowFocus={true} // 窗口获得焦点时刷新会话
    >
      {children}
    </SessionProvider>
  )
}
