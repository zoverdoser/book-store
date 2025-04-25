'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, Users, BarChart3, Tags, Settings } from 'lucide-react'

const navigation = [
  { name: '仪表盘', href: '/admin', icon: BarChart3 },
  { name: '分类&标签管理', href: '/admin/tags', icon: Tags },
  { name: '图书管理', href: '/admin/books', icon: BookOpen },
  { name: '用户管理', href: '/admin/users', icon: Users },
  // { name: '系统设置', href: '/admin/settings', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="flex h-16 items-center justify-center border-b">
        <h1 className="text-xl font-bold text-gray-800">管理后台</h1>
      </div>
      <nav className="mt-5 px-2">
        {navigation.map(item => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon
                className={`mr-3 h-6 w-6 flex-shrink-0 ${
                  isActive ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'
                }`}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
