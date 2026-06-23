'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { deliveriesApi } from '@/lib/api/client'
import type { DeliveryRecord, DeliveryStatus } from '@/types'
import { getStatusColor, getStatusLabel, formatDateTime } from '@/lib/utils'
import { Search, Download, Eye, Trash2, Filter } from 'lucide-react'

const STATUS_OPTIONS = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '待发送' },
  { value: 'sent', label: '已发送' },
  { value: 'replied', label: '已回复' },
  { value: 'interview', label: '面试中' },
  { value: 'offer', label: '已Offer' },
  { value: 'rejected', label: '已拒绝' },
]

export default function DeliveriesPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<DeliveryRecord | null>(null)

  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['deliveries', statusFilter, search, page],
    queryFn: async () => {
      const params: any = { page, page_size: 20 }
      if (statusFilter !== 'all') {
        params.status = statusFilter
      }
      if (search) {
        params.search = search
      }
      const response = await deliveriesApi.list(params)
      return response.data
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { status?: DeliveryStatus; notes?: string } }) =>
      deliveriesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveries'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deliveriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveries'] })
    },
  })

  const handleExport = async () => {
    const response = await deliveriesApi.export()
    const blob = new Blob([response.data], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `deliveries_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const openDetail = (record: DeliveryRecord) => {
    setSelectedRecord(record)
    setIsDetailOpen(true)
  }

  const records = data || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">投递管理</h1>
          <p className="text-gray-500">管理您的求职投递记录</p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          导出CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="搜索岗位名称或公司..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => {
              setStatusFilter(v)
              setPage(1)
            }}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Records List */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-500">加载中...</div>
      ) : records.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">暂无投递记录</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-3">
            {records.map((record: DeliveryRecord) => (
              <Card key={record.id} className="hover:shadow-md transition-shadow">
                <CardContent className="py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-gray-900">{record.job_title}</h3>
                        <span className={`rounded-full px-2 py-0.5 text-xs ${getStatusColor(record.status)}`}>
                          {getStatusLabel(record.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{record.company_name}</p>
                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400">
                        {record.salary && <span>{record.salary}</span>}
                        {record.location && <span>{record.location}</span>}
                        {record.ai_score && (
                          <span className="text-blue-600">AI匹配: {record.ai_score}分</span>
                        )}
                        {record.sent_at && (
                          <span>发送于: {formatDateTime(record.sent_at)}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openDetail(record)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMutation.mutate(record.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              上一页
            </Button>
            <span className="text-sm text-gray-500">
              第 {page} 页
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={records.length < 20}
            >
              下一页
            </Button>
          </div>
        </>
      )}

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedRecord?.job_title}</DialogTitle>
            <DialogDescription>{selectedRecord?.company_name}</DialogDescription>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-500">薪资：</span>
                  {selectedRecord.salary || '未提供'}
                </div>
                <div>
                  <span className="font-medium text-gray-500">城市：</span>
                  {selectedRecord.location || '未提供'}
                </div>
                <div>
                  <span className="font-medium text-gray-500">AI评分：</span>
                  {selectedRecord.ai_score ? `${selectedRecord.ai_score}分` : '未评分'}
                </div>
                <div>
                  <span className="font-medium text-gray-500">状态：</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${getStatusColor(selectedRecord.status)}`}>
                    {getStatusLabel(selectedRecord.status)}
                  </span>
                </div>
              </div>

              {selectedRecord.ai_reason && (
                <div>
                  <Label className="text-gray-500">AI评分理由：</Label>
                  <p className="mt-1 text-sm">{selectedRecord.ai_reason}</p>
                </div>
              )}

              {selectedRecord.job_description && (
                <div>
                  <Label className="text-gray-500">岗位描述：</Label>
                  <p className="mt-1 text-sm whitespace-pre-wrap">{selectedRecord.job_description}</p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Select
                  value={selectedRecord.status}
                  onValueChange={(v) =>
                    updateMutation.mutate({
                      id: selectedRecord.id,
                      data: { status: v as DeliveryStatus },
                    })
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.filter((s) => s.value !== 'all').map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedRecord.job_url && (
                  <Button
                    variant="outline"
                    onClick={() => window.open(selectedRecord.job_url, '_blank')}
                  >
                    查看原帖
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
