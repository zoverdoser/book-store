import {
  User as PrismaUser,
  Book as PrismaBook,
  Author as PrismaAuthor,
  Category as PrismaCategory,
  Tag as PrismaTag,
  UserUpload as PrismaUserUpload,
  Notification as PrismaNotification,
  UserPointHistory as PrismaUserPointHistory,
} from '@prisma/client'

declare global {
  type User = Omit<PrismaUser, 'password' | 'role'> & {
    id: string
    role: UserRole
  }

  type Author = PrismaAuthor
  type Tag = PrismaTag
  type UserUpload = PrismaUserUpload
  type Notification = PrismaNotification
  type UserPointHistory = PrismaUserPointHistory
  type Category = PrismaCategory
  type Book = PrismaBook & {
    authors: Author[]
    categories: Category[]
    tags: Tag[]
    downloadCount: number
  }

  type UserRole = 'USER' | 'ADMIN'
  type UserStatus = 'ACTIVE' | 'SUSPENDED'
  type UploadStatus = 'PENDING' | 'APPROVED' | 'REJECTED'
  type FileType = 'PDF' | 'EPUB' | 'TXT'
  type PointType = 'UPLOAD' | 'DOWNLOAD'
  type NotificationType = 'BOOK_APPROVED' | 'BOOK_REJECTED'
  type Language = 'zh-CN' | 'zh-TW' | 'en'

  interface BookWithRelations extends Book {
    authors: Author[]
    categories: Category[]
    tags: Tag[]
  }

  interface UserWithRelations extends User {
    uploads: UserUpload[]
    pointHistory: UserPointHistory[]
    notifications: Notification[]
  }

  interface BookFormData {
    title: string
    author: string
    price: string
    stock: string
    description: string
    cover: string
    categoryIds: string[]
    tagIds: string[]
  }

  interface BookDialogProps {
    open: boolean
    onClose: () => void
    onSubmit: (data: BookFormData) => void
    initialData?: BookFormData
    categories: Category[]
    tags: Tag[]
  }
}
