import { User, Book, Author, Category, Tag, UserUpload, Notification, UserPointHistory } from '@prisma/client'

export type { User, Book, Author, Category, Tag, UserUpload, Notification, UserPointHistory }

export type UserRole = 'USER' | 'ADMIN'
export type UserStatus = 'ACTIVE' | 'SUSPENDED'
export type UploadStatus = 'PENDING' | 'APPROVED' | 'REJECTED'
export type FileType = 'PDF' | 'EPUB' | 'TXT'
export type PointType = 'UPLOAD' | 'DOWNLOAD'
export type NotificationType = 'BOOK_APPROVED' | 'BOOK_REJECTED'
export type Language = 'zh-CN' | 'zh-TW' | 'en'

export interface BookWithRelations extends Book {
  authors: Author[]
  categories: Category[]
  tags: Tag[]
}

export interface UserWithRelations extends User {
  uploads: UserUpload[]
  pointHistory: UserPointHistory[]
  notifications: Notification[]
}
