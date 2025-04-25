import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'ADMIN') {
      return errorResponse('Unauthorized', 401)
    }

    const books = await prisma.book.findMany({
      include: {
        authors: true,
        categories: true,
        tags: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return successResponse(books)
  } catch (error) {
    console.error('Error fetching books:', error)
    return errorResponse('Internal Server Error', 500)
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'ADMIN') {
      return errorResponse('Unauthorized', 401)
    }

    const data = await request.json()
    const { title, description, cover, isActive, categoryIds, tagIds, authorIds } = data

    const book = await prisma.book.create({
      data: {
        title,
        description,
        cover,
        isActive,
        categories: {
          connect: categoryIds.map((id: string) => ({ id })),
        },
        tags: {
          connect: tagIds.map((id: string) => ({ id })),
        },
        authors: {
          connect: authorIds.map((id: number) => ({ id })),
        },
      },
    })

    return successResponse(book)
  } catch (error) {
    console.error('Error creating book:', error)
    return errorResponse('Internal Server Error', 500)
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'ADMIN') {
      return errorResponse('Unauthorized', 401)
    }

    const data = await request.json()
    const { id, title, description, cover, isActive, categoryIds, tagIds, authorIds } = data

    const book = await prisma.book.update({
      where: { id },
      data: {
        title,
        description,
        cover,
        isActive,
        categories: {
          set: categoryIds.map((id: string) => ({ id })),
        },
        tags: {
          set: tagIds.map((id: string) => ({ id })),
        },
        authors: {
          set: authorIds.map((id: number) => ({ id })),
        },
      },
    })

    return successResponse(book)
  } catch (error) {
    console.error('Error updating book:', error)
    return errorResponse('Internal Server Error', 500)
  }
}
