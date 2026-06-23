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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { jobConfigsApi } from '@/lib/api/client'
import type { JobConfig } from '@/types'
import { Plus, Pencil, Trash2, Play, Pause, Square } from 'lucide-react'
import { useAgentStore } from '@/lib/stores/agent-store'

const CITIES = [
  '北京', '上海', '广州', '深圳', '杭州', '南京', '成都', '武汉', '西安', '苏州',
  '天津', '重庆', '长沙', '郑州', '青岛', '济南', '福州', '厦门', '合肥', '昆明',
]

const SALARY_RANGES = ['不限', '150-300/天', '300-500/天', '500-800/天', '8K-15K', '15K-25K', '25K以上']

const EDUCATION_OPTIONS = ['不限', '大专', '本科', '硕士', '博士']

const COMPANY_SIZES = ['不限', '50-100人', '100-500人', '500-1000人', '1000人以上']

export default function ConfigPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingConfig, setEditingConfig] = useState<JobConfig | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    keywords: '',
    cities: [] as string[],
    salary_range: '不限',
    education: '不限',
    company_size: [] as string[],
  })

  const queryClient = useQueryClient()
  const { isRunning, isPaused, setRunning, setPaused, reset } = useAgentStore()

  const { data: configs = [], isLoading } = useQuery({
    queryKey: ['job-configs'],
    queryFn: async () => {
      const response = await jobConfigsApi.list()
      return response.data
    },
  })

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = {
        name: data.name,
        keywords: data.keywords.split(',').map((k) => k.trim()).filter(Boolean),
        cities: data.cities,
        salary_range: data.salary_range,
        education: data.education,
        company_size: data.company_size,
        is_active: true,
      }
      if (editingConfig) {
        return jobConfigsApi.update(editingConfig.id, payload)
      }
      return jobConfigsApi.create(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-configs'] })
      setIsDialogOpen(false)
      resetForm()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => jobConfigsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-configs'] })
    },
  })

  const resetForm = () => {
    setEditingConfig(null)
    setFormData({
      name: '',
      keywords: '',
      cities: [],
      salary_range: '不限',
      education: '不限',
      company_size: [],
    })
  }

  const openEditDialog = (config: JobConfig) => {
    setEditingConfig(config)
    setFormData({
      name: config.name,
      keywords: config.keywords.join(', '),
      cities: config.cities || [],
      salary_range: config.salary_range || '不限',
      education: config.education || '不限',
      company_size: config.company_size || [],
    })
    setIsDialogOpen(true)
  }

  const toggleCity = (city: string) => {
    setFormData((prev) => ({
      ...prev,
      cities: prev.cities.includes(city)
        ? prev.cities.filter((c) => c !== city)
        : [...prev.cities, city],
    }))
  }

  const toggleCompanySize = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      company_size: prev.company_size.includes(size)
        ? prev.company_size.filter((s) => s !== size)
        : [...prev.company_size, size],
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">岗位配置</h1>
          <p className="text-gray-500">配置求职搜索条件和自动化投递</p>
        </div>
        <Button
          onClick={() => {
            resetForm()
            setIsDialogOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          新建配置
        </Button>
      </div>

      {/* Agent Control Panel */}
      {isRunning && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              {isPaused ? (
                <Pause className="h-6 w-6 text-blue-600" />
              ) : (
                <Play className="h-6 w-6 text-blue-600" />
              )}
              <div>
                <p className="font-medium text-blue-900">投递任务运行中</p>
                <p className="text-sm text-blue-600">
                  {isPaused ? '已暂停' : '正在投递中...'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPaused(!isPaused)}
              >
                {isPaused ? <Play className="mr-2 h-4 w-4" /> : <Pause className="mr-2 h-4 w-4" />}
                {isPaused ? '继续' : '暂停'}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={reset}
              >
                <Square className="mr-2 h-4 w-4" />
                停止
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">加载中...</div>
      ) : configs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">暂无配置，点击新建配置开始</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {configs.map((config) => (
            <Card key={config.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{config.name}</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(config)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteMutation.mutate(config.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">关键词：</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {config.keywords.map((kw, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {config.cities.length > 0 && (
                    <div>
                      <span className="font-medium">城市：</span>
                      {config.cities.join(', ')}
                    </div>
                  )}
                  {config.salary_range && (
                    <div>
                      <span className="font-medium">薪资：</span>
                      {config.salary_range}
                    </div>
                  )}
                </div>
                {config.is_active && !isRunning && (
                  <Button className="mt-2 w-full" size="sm">
                    <Play className="mr-2 h-4 w-4" />
                    开始投递
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingConfig ? '编辑配置' : '新建配置'}</DialogTitle>
            <DialogDescription>设置岗位搜索条件和筛选偏好</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              createMutation.mutate(formData)
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="name">配置名称</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="如：杭州AI产品经理"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">搜索关键词（用逗号分隔）</Label>
              <Input
                id="keywords"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                placeholder="如：AI产品经理, 产品经理"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>城市（可多选）</Label>
              <div className="flex flex-wrap gap-2">
                {CITIES.map((city) => (
                  <label
                    key={city}
                    className={`flex items-center rounded-full border px-3 py-1 text-sm cursor-pointer transition-colors ${
                      formData.cities.includes(city)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background hover:bg-gray-100'
                    }`}
                  >
                    <Checkbox
                      checked={formData.cities.includes(city)}
                      onCheckedChange={() => toggleCity(city)}
                      className="mr-2"
                    />
                    {city}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>薪资范围</Label>
                <Select
                  value={formData.salary_range}
                  onValueChange={(v) => setFormData({ ...formData, salary_range: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SALARY_RANGES.map((range) => (
                      <SelectItem key={range} value={range}>
                        {range}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>学历要求</Label>
                <Select
                  value={formData.education}
                  onValueChange={(v) => setFormData({ ...formData, education: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EDUCATION_OPTIONS.map((edu) => (
                      <SelectItem key={edu} value={edu}>
                        {edu}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>公司规模（可多选）</Label>
              <div className="flex flex-wrap gap-2">
                {COMPANY_SIZES.map((size) => (
                  <label
                    key={size}
                    className={`flex items-center rounded-full border px-3 py-1 text-sm cursor-pointer transition-colors ${
                      formData.company_size.includes(size)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background hover:bg-gray-100'
                    }`}
                  >
                    <Checkbox
                      checked={formData.company_size.includes(size)}
                      onCheckedChange={() => toggleCompanySize(size)}
                      className="mr-2"
                    />
                    {size}
                  </label>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                取消
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? '保存中...' : '保存'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
