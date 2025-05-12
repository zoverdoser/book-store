'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pagination } from '@/components/ui/pagination'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'

export default function TagList() {
  const [tags, setTags] = useState<Tag[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(0)
  const searchKeywordRef = useRef('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newTagName, setNewTagName] = useState('')
  const { toast } = useToast()

  const fetchTags = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/tags?page=${currentPage}&keyword=${searchKeywordRef.current}`)
      const data = await response.json()
      if (data.success) {
        setTags(data.data.data)
        setTotal(data.data.total || 0)
      }
    } catch (error) {
      console.error('Error fetching tags:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTags()
  }, [currentPage])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      searchKeywordRef.current = (e.target as HTMLInputElement).value
      setCurrentPage(1)
      fetchTags()
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // TODO: 调用API获取标签列表
  }

  const handleCreateTag = async () => {
    try {
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newTagName }),
      })

      const data = await response.json()
      if (data.success) {
        toast({
          title: '创建成功',
          description: '标签已成功创建',
        })
        setIsCreateDialogOpen(false)
        setNewTagName('')
        fetchTags() // 刷新列表
      } else {
        toast({
          title: '创建失败',
          description: data.message || '创建标签失败',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error creating tag:', error)
      toast({
        title: '创建失败',
        description: '创建标签时发生错误',
        variant: 'destructive',
      })
    }
  }

  return (
    <>
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="搜索标签..."
            onKeyDown={handleKeyDown}
            className="w-64"
          />
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>新建标签</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>标签名称</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={2} className="text-center">加载中...</TableCell>
            </TableRow>
          ) : tags.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2} className="text-center">暂无数据</TableCell>
            </TableRow>
          ) : (
            tags.map(tag => (
              <TableRow key={tag.id}>
                <TableCell>{tag.name}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    编辑
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-500">
                    删除
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="flex justify-center">
        <Pagination currentPage={currentPage} total={total} pageSize={10} onPageChange={handlePageChange} />
      </div>
    </div>
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>新建标签</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <Input
          placeholder="请输入标签名称"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
        />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
          取消
        </Button>
        <Button onClick={handleCreateTag} disabled={!newTagName.trim()}>
          创建
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  </>
  )
}
