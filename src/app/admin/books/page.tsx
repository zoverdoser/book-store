'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { BookDialog } from '@/components/admin/BookDialog'

interface Book {
  id: string
  title: string
  description: string | null
  cover: string | null
  isActive: boolean
  authors: { id: number; name: string }[]
  categories: { id: string; name: string }[]
  tags: { id: string; name: string }[]
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

export default function BooksPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    try {
      const response = await fetch('/api/books')
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.msg || '获取图书列表失败')
      }

      setBooks(data.data)
    } catch (error) {
      console.error('Error fetching books:', error)
      toast({
        title: '错误',
        description: error instanceof Error ? error.message : '获取图书列表失败',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddBook = () => {
    setSelectedBook(null)
    setDialogOpen(true)
  }

  const handleEditBook = (book: Book) => {
    setSelectedBook(book)
    setDialogOpen(true)
  }

  const handleDeleteBook = async (id: string) => {
    if (!confirm('确定要删除这本书吗？')) return

    try {
      const response = await fetch(`/api/books/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.msg || '删除失败')
      }

      setBooks(books.filter(book => book.id !== id))
      toast({
        title: '成功',
        description: '删除成功',
      })
    } catch (error) {
      console.error('Error deleting book:', error)
      toast({
        title: '错误',
        description: error instanceof Error ? error.message : '删除失败',
        variant: 'destructive',
      })
    }
  }

  const handleSubmit = async (data: BookFormData) => {
    try {
      const url = selectedBook ? `/api/books/${selectedBook.id}` : '/api/books'
      const method = selectedBook ? 'PUT' : 'POST'
      const body = selectedBook ? { ...data, id: selectedBook.id } : data

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      const responseData = await response.json()

      if (!responseData.success) {
        throw new Error(responseData.msg || (selectedBook ? '更新失败' : '添加失败'))
      }

      if (selectedBook) {
        setBooks(books.map(book => (book.id === selectedBook.id ? responseData.data : book)))
        toast({
          title: '成功',
          description: '更新成功',
        })
      } else {
        setBooks([...books, responseData.data])
        toast({
          title: '成功',
          description: '添加成功',
        })
      }

      setDialogOpen(false)
    } catch (error) {
      console.error('Error submitting book:', error)
      toast({
        title: '错误',
        description: error instanceof Error ? error.message : selectedBook ? '更新失败' : '添加失败',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return <div>加载中...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">图书管理</h1>
        <Button onClick={handleAddBook}>
          <Plus className="h-4 w-4 mr-2" />
          添加图书
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">封面</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">书名</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作者</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {books.map(book => (
                <tr key={book.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {book.cover ? (
                      <Image src={book.cover} alt={book.title} width={40} height={40} className="rounded object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded bg-gray-200" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{book.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{book.authors.map(author => author.name).join(', ')}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        book.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {book.isActive ? '上架' : '下架'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => handleEditBook(book)} className="text-blue-600 hover:text-blue-900 mr-4">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDeleteBook(book.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <BookDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleSubmit} book={selectedBook} />
    </div>
  )
}
