'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'

interface Author {
  id: number
  name: string
}

interface Category {
  id: string
  name: string
}

interface Tag {
  id: string
  name: string
}

interface Book {
  id: string
  title: string
  description: string | null
  cover: string | null
  isActive: boolean
  authors: Author[]
  categories: Category[]
  tags: Tag[]
}

interface BookFormData {
  title: string
  description?: string
  cover?: string
  isActive: boolean
  categoryIds: string[]
  tagIds: string[]
  authorIds: number[]
}

interface BookDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: BookFormData) => void
  book?: Book | null
}

export function BookDialog({ open, onOpenChange, onSubmit, book }: BookDialogProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    description: '',
    cover: '',
    isActive: true,
    categoryIds: [],
    tagIds: [],
    authorIds: [],
  })
  const [authors, setAuthors] = useState<Author[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        description: book.description || '',
        cover: book.cover || '',
        isActive: book.isActive,
        categoryIds: book.categories.map(c => c.id),
        tagIds: book.tags.map(t => t.id),
        authorIds: book.authors.map(a => a.id),
      })
    } else {
      setFormData({
        title: '',
        description: '',
        cover: '',
        isActive: true,
        categoryIds: [],
        tagIds: [],
        authorIds: [],
      })
    }
  }, [book])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [categoriesRes, tagsRes] = await Promise.all([fetch('/api/categories'), fetch('/api/tags')])

      const [categoriesData, tagsData] = await Promise.all([categoriesRes.json(), tagsRes.json()])

      if (!categoriesData.success || !tagsData.success) {
        throw new Error('获取数据失败')
      }

      setCategories(categoriesData.data)
      setTags(tagsData.data)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast({
        title: '错误',
        description: '获取数据失败',
        variant: 'destructive',
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      onSubmit(formData)
      onOpenChange(false)
    } catch (error) {
      console.error('Error submitting form:', error)
      toast({
        title: '错误',
        description: '提交失败',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{book ? '编辑图书' : '添加图书'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">书名</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">描述</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover">封面图片 URL</Label>
            <Input id="cover" value={formData.cover} onChange={e => setFormData({ ...formData, cover: e.target.value })} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="authors">作者</Label>
            <div className="grid grid-cols-2 gap-2">
              {authors.map(author => (
                <div key={author.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`author-${author.id}`}
                    checked={formData.authorIds.includes(author.id)}
                    onChange={e => {
                      const newAuthorIds = e.target.checked
                        ? [...formData.authorIds, author.id]
                        : formData.authorIds.filter(id => id !== author.id)
                      setFormData({ ...formData, authorIds: newAuthorIds })
                    }}
                  />
                  <label htmlFor={`author-${author.id}`}>{author.name}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="categories">分类</Label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map(category => (
                <div key={category.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`category-${category.id}`}
                    checked={formData.categoryIds.includes(category.id)}
                    onChange={e => {
                      const newCategoryIds = e.target.checked
                        ? [...formData.categoryIds, category.id]
                        : formData.categoryIds.filter(id => id !== category.id)
                      setFormData({ ...formData, categoryIds: newCategoryIds })
                    }}
                  />
                  <label htmlFor={`category-${category.id}`}>{category.name}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">标签</Label>
            <div className="grid grid-cols-2 gap-2">
              {tags.map(tag => (
                <div key={tag.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`tag-${tag.id}`}
                    checked={formData.tagIds.includes(tag.id)}
                    onChange={e => {
                      const newTagIds = e.target.checked
                        ? [...formData.tagIds, tag.id]
                        : formData.tagIds.filter(id => id !== tag.id)
                      setFormData({ ...formData, tagIds: newTagIds })
                    }}
                  />
                  <label htmlFor={`tag-${tag.id}`}>{tag.name}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked: boolean) => setFormData({ ...formData, isActive: checked })}
            />
            <Label htmlFor="isActive">上架状态</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '提交中...' : '确定'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
