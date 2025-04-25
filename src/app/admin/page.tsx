import { Card } from '@/components/ui/card'
import { BookOpen, Users, ShoppingCart, DollarSign } from 'lucide-react'

const stats = [
  { name: '总图书数', value: '1,234', icon: BookOpen },
  { name: '总用户数', value: '567', icon: Users },
  { name: '总订单数', value: '890', icon: ShoppingCart },
  { name: '总收入', value: '¥45,678', icon: DollarSign },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">仪表盘</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(stat => (
          <Card key={stat.name}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">{stat.name}</dt>
                  <dd className="mt-1 text-lg font-semibold text-gray-900">{stat.value}</dd>
                </dl>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-medium text-gray-900">最近订单</h2>
          <div className="mt-4">{/* 这里可以添加最近订单列表 */}</div>
        </Card>

        <Card>
          <h2 className="text-lg font-medium text-gray-900">系统消息</h2>
          <div className="mt-4">{/* 这里可以添加系统消息列表 */}</div>
        </Card>
      </div>
    </div>
  )
}
