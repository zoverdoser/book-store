'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pagination } from '@/components/ui/pagination'

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [searchKeyword, setSearchKeyword] = useState('')

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword)
    setCurrentPage(1)
    // TODO: 调用API获取分类列表
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // TODO: 调用API获取分类列表
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="搜索分类..."
            value={searchKeyword}
            onChange={e => handleSearch(e.target.value)}
            className="w-64"
          />
        </div>
        <Button>新建分类</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>分类名称</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map(category => (
            <TableRow key={category.id}>
              <TableCell>{category.name}</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">
                  编辑
                </Button>
                <Button variant="ghost" size="sm" className="text-red-500">
                  删除
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-center">
        <Pagination currentPage={currentPage} total={total} pageSize={10} onPageChange={handlePageChange} />
      </div>
    </div>
  )
}
