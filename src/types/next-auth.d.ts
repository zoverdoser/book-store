import { UserRole } from './index'
import 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    role: UserRole
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: UserRole
  }
}
