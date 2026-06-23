'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Briefcase, MessageSquare, TrendingUp, Users } from 'lucide-react'
import { deliveriesApi } from '@/lib/api/client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function DashboardPage() {
  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const response = await deliveriesApi.getStats()
      return response.data
    },
  })

  const statCards = [
    {
      title: '今日发送',
      value: stats?.today_sent || 0,
      icon: MessageSquare,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      title: '累计发送',
      value: stats?.total_sent || 0,
      icon: Briefcase,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      title: '回复率',
      value: `${stats?.reply_rate || 0}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
    {
      title: '面试率',
      value: `${stats?.interview_rate || 0}%`,
      icon: Users,
      color: 'text-orange-600',
      bg: 'bg-orange-100',
    },
  ]

  const chartData = [
    { name: '已发送', value: stats?.total_sent || 0 },
    { name: '已回复', value: stats?.total_replied || 0 },
    { name: '面试中', value: stats?.total_interview || 0 },
    { name: 'Offer', value: stats?.total_offer || 0 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">查看您的求职投递统计概览</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <div className={`rounded-full p-2 ${card.bg}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>投递漏斗</CardTitle>
            <CardDescription>投递转化情况</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>快速操作</CardTitle>
            <CardDescription>常用功能入口</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <QuickAction
              title="开始自动投递"
              description="使用配置的岗位和模板开始自动投递"
              href="/dashboard/config"
            />
            <QuickAction
              title="管理消息模板"
              description="创建或编辑求职消息模板"
              href="/dashboard/templates"
            />
            <QuickAction
              title="查看投递记录"
              description="查看和管理所有投递记录"
              href="/dashboard/deliveries"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function QuickAction({
  title,
  description,
  href,
}: {
  title: string
  description: string
  href: string
}) {
  return (
    <a
      href={href}
      className="block rounded-lg border p-4 transition-colors hover:bg-gray-50"
    >
      <div className="font-medium text-gray-900">{title}</div>
      <div className="text-sm text-gray-500">{description}</div>
    </a>
  )
}
